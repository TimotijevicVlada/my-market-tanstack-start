import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { betterAuthMiddleware } from '@/lib/middleware'
import { db } from '@/db'
import { user } from '@/db/schema'

export const getSessionUser = createServerFn({ method: "GET" })
  .handler(async () => {
    const { headers } = getRequest()
    const session = await auth.api.getSession({ headers })
    return {
      user: session?.user
    }
  })

export const updateSessionUserAvatar = createServerFn({
  method: 'POST',
})
  .middleware([betterAuthMiddleware])
  .inputValidator((data: { avatarUrl: string | null | undefined }) => data)
  .handler(async ({ context, data }) => {
    const { user: userData } = context
    const { avatarUrl } = data

    const [updatedUser] = await db
      .update(user)
      .set({ image: avatarUrl })
      .where(eq(user.id, userData.id))
      .returning()

    return { user: updatedUser }
  })

export const updateSessionUserEmail = createServerFn({
  method: 'POST',
})
  .middleware([betterAuthMiddleware])
  .inputValidator((data: { email: string }) => data)
  .handler(async ({ context, data }) => {
    const { user: userData } = context
    const { email } = data

    const existingUserByEmail = await db.query.user.findFirst({
      where: (userTable) => eq(userTable.email, data.email),
    })

    if (existingUserByEmail && existingUserByEmail.id !== userData.id) {
      throw new Error('Email je već zauzet')
    }

    const [updatedUser] = await db
      .update(user)
      .set({ email })
      .where(eq(user.id, userData.id))
      .returning()

    return { user: updatedUser }
  })