import bcrypt from 'bcryptjs'
import { createServerFn } from '@tanstack/react-start'
import { count, desc, eq } from 'drizzle-orm'
import { requireAdminMiddleware } from '../middleware'
import type { GetUsersParams } from './types'
import type { UserSchema } from '@/routes/_private/users/-components/CreateUser/schema'
import { db } from '@/db'
import { users } from '@/db/schema/users'

export const getPagedUsers = createServerFn({
  method: 'POST',
})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: GetUsersParams) => data)
  .handler(async ({ data }) => {
    const { page, limit } = data

    const offset = (page - 1) * limit

    const [totalResult] = await db.select({ count: count() }).from(users)
    const total = totalResult.count

    const result = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset)

    return {
      data: result,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  })

export const toggleUserActiveStatus = createServerFn({
  method: 'POST',
})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    const { userId } = data

    const user = await db.query.users.findFirst({
      where: (usersTable) => eq(usersTable.id, userId),
    })

    if (!user) {
      throw new Error('Korisnik nije pronađen')
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        isActive: !user.isActive,
      })
      .where(eq(users.id, userId))
      .returning()

    return updatedUser
  })

export const createUser = createServerFn({
  method: 'POST',
})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: UserSchema) => data)
  .handler(async ({ data }) => {
    const existingUserByEmail = await db.query.users.findFirst({
      where: (userTable) => eq(userTable.email, data.email),
    })

    if (existingUserByEmail) {
      throw new Error('Email je već zauzet')
    }

    const existingUserByUsername = await db.query.users.findFirst({
      where: (userTable) => eq(userTable.username, data.username),
    })

    if (existingUserByUsername) {
      throw new Error('Korisničko ime je već zauzeto')
    }

    const passwordHash = await bcrypt.hash(data.password, 10)

    const [user] = await db
      .insert(users)
      .values({
        username: data.username,
        email: data.email,
        passwordHash,
        role: data.role,
      })
      .returning()

    const { passwordHash: _, ...userWithoutPassword } = user
    return {
      user: userWithoutPassword,
    }
  })

export const deleteUser = createServerFn({
  method: 'POST',
})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    const { userId } = data

    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning()

    return {
      user: deletedUser,
    }
  })
