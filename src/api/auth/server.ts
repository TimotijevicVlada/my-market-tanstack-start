import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { authMiddleware } from '@/lib/middleware'
import { db } from '@/db'
import { user } from '@/db/schema/better-auth'

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
  .middleware([authMiddleware])
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

export const updateSessionUserBasicInfo = createServerFn({
  method: 'POST',
})
  .middleware([authMiddleware])
  .inputValidator((data: { name: string; email: string }) => data)
  .handler(async ({ context, data }) => {
    const { user: userData } = context
    const { name, email } = data

    const existingUserByEmail = await db.query.user.findFirst({
      where: (userTable) => eq(userTable.email, email),
    })

    if (existingUserByEmail && existingUserByEmail.id !== userData.id) {
      throw new Error('Email je već zauzet')
    }

    const [updatedUser] = await db
      .update(user)
      .set({ name, email })
      .where(eq(user.id, userData.id))
      .returning()

    return { user: updatedUser }
  })

export const getLinkedAccounts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {

    const { user: sessionUser } = context

    const accounts = await db.query.account.findMany({
      where: (a) => eq(a.userId, sessionUser.id),
    })

    return accounts
  })

export const linkAccountWithCredentials = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    await auth.api.setPassword({
      body: {
        newPassword: data.password,
      },
      headers: await getRequest().headers
    });
  })