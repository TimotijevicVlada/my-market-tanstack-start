import bcrypt from 'bcryptjs'
import { createServerFn } from '@tanstack/react-start'
import { count, desc, eq, ilike, or } from 'drizzle-orm'
import { requireAdminMiddleware } from '../middleware'
import type { GetUsersParams } from './types'
import type { UserSchema } from '@/routes/_private/users/-components/CreateUser/schema'
import { db } from '@/db'
import { users } from '@/db/schema/users'
import { producers } from '@/db/schema/producers'
import { products } from '@/db/schema/products'

export const getPagedUsers = createServerFn({
  method: 'POST',
})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: GetUsersParams) => data)
  .handler(async ({ data }) => {
    const { page, limit, keyword } = data
    const trimmedKeyword = keyword?.trim()
    const hasKeyword = trimmedKeyword !== ''

    const offset = (page - 1) * limit

    const totalQuery = db.select({ count: count() }).from(users)
    if (hasKeyword) {
      totalQuery.where(
        or(
          ilike(users.username, `%${trimmedKeyword}%`),
          ilike(users.email, `%${trimmedKeyword}%`),
        ),
      )
    }
    const [totalResult] = await totalQuery
    const total = totalResult.count

    const query = db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        productCount: count(products.id).as('product_count'),
      })
      .from(users)
      .leftJoin(producers, eq(producers.userId, users.id))
      .leftJoin(products, eq(products.producerId, producers.id))
      .groupBy(users.id)

    if (hasKeyword) {
      query.where(
        or(
          ilike(users.username, `%${trimmedKeyword}%`),
          ilike(users.email, `%${trimmedKeyword}%`),
        ),
      )
    }

    const result = await query
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
