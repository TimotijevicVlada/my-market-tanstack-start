import bcrypt from 'bcryptjs'
import { createServerFn } from '@tanstack/react-start'
import {
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  or,
} from 'drizzle-orm'
import { authMiddleware, requireAdminMiddleware } from '../middleware'
import type { GetUsersParams } from './types'
import type {
  CreateUserSchema,
  EditUserSchema,
} from '@/routes/_private/admin/users/-components/zod-schema'
import type { EditPasswordSchema } from '@/routes/_private/admin/users/-components/EditPassword/zod-schema'
import { db } from '@/db'
import { users } from '@/db/schema/users'
import { sellers } from '@/db/schema/sellers'
import { products } from '@/db/schema/products'

export const getAllUsers = createServerFn({
  method: 'GET',
})
  .middleware([requireAdminMiddleware])
  .handler(async () => {
    const usersList = await db.query.users.findMany({
      orderBy: (usersTable) => [asc(usersTable.username)],
    })
    return usersList
  })

export const getPagedUsers = createServerFn({
  method: 'POST',
})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: GetUsersParams) => data)
  .handler(async ({ data }) => {
    const { page, limit, keyword, status, role, sort } = data
    const trimmedKeyword = keyword?.trim()
    const hasKeyword = trimmedKeyword !== ''

    const offset = (page - 1) * limit

    const conditions = []
    if (hasKeyword) {
      conditions.push(
        or(
          ilike(users.username, `%${trimmedKeyword}%`),
          ilike(users.email, `%${trimmedKeyword}%`),
        ),
      )
    }
    if (status) {
      conditions.push(eq(users.isActive, status === 'active' ? true : false))
    }
    if (role) {
      conditions.push(eq(users.role, role))
    }

    const totalQuery = db.select({ count: count() }).from(users)

    if (conditions.length > 0) {
      totalQuery.where(and(...conditions))
    }
    const [totalResult] = await totalQuery
    const total = totalResult.count

    const query = db
      .select({
        ...getTableColumns(users),
        productCount: count(products.id).as('product_count'),
      })
      .from(users)
      .leftJoin(sellers, eq(sellers.userId, users.id))
      .leftJoin(products, eq(products.sellerId, sellers.id))
      .groupBy(users.id)

    if (conditions.length > 0) {
      query.where(and(...conditions))
    }

    const orderByColumn =
      sort.key === 'productCount' ? count(products.id) : users[sort.key]
    const result = await query
      .orderBy(
        sort.order === 'asc' ? asc(orderByColumn) : desc(orderByColumn),
        desc(users.id),
      )
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
  .inputValidator((data: CreateUserSchema) => data)
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

export const editUser = createServerFn({
  method: 'POST',
})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: EditUserSchema & { userId: string }) => data)
  .handler(async ({ data }) => {
    const { userId } = data

    const existingUserByEmail = await db.query.users.findFirst({
      where: (userTable) => eq(userTable.email, data.email),
    })

    if (existingUserByEmail && existingUserByEmail.id !== userId) {
      throw new Error('Email je već zauzet')
    }

    const existingUserByUsername = await db.query.users.findFirst({
      where: (userTable) => eq(userTable.username, data.username),
    })

    if (existingUserByUsername && existingUserByUsername.id !== userId) {
      throw new Error('Korisničko ime je već zauzeto')
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        username: data.username,
        email: data.email,
        role: data.role,
      })
      .where(eq(users.id, userId))
      .returning()

    return updatedUser
  })

export const editUserPassword = createServerFn({
  method: 'POST',
})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: EditPasswordSchema & { userId: string }) => data)
  .handler(async ({ data }) => {
    const { userId } = data

    const passwordHash = await bcrypt.hash(data.password, 10)

    const [updatedUser] = await db
      .update(users)
      .set({ passwordHash })
      .where(eq(users.id, userId))
      .returning()

    const { passwordHash: _, ...userWithoutPassword } = updatedUser

    return {
      user: userWithoutPassword,
    }
  })

export const updateMyUserAvatar = createServerFn({
  method: 'POST',
})
  .middleware([authMiddleware])
  .inputValidator((data: { avatarUrl: string | null | undefined }) => data)
  .handler(async ({ context, data }) => {
    const { user } = context
    const { avatarUrl } = data

    const [updatedUser] = await db
      .update(users)
      .set({ avatarUrl })
      .where(eq(users.id, user?.id ?? ''))
      .returning()

    return { user: updatedUser }
  })

export const updateMyUserEmail = createServerFn({
  method: 'POST',
})
  .middleware([authMiddleware])
  .inputValidator((data: { email: string }) => data)
  .handler(async ({ context, data }) => {
    const { user } = context
    const { email } = data

    const existingUserByEmail = await db.query.users.findFirst({
      where: (userTable) => eq(userTable.email, data.email),
    })

    if (existingUserByEmail && existingUserByEmail.id !== user?.id) {
      throw new Error('Email je već zauzet')
    }

    const [updatedUser] = await db
      .update(users)
      .set({ email })
      .where(eq(users.id, user?.id ?? ''))
      .returning()

    return { user: updatedUser }
  })

export const updateMyUserPassword = createServerFn({
  method: 'POST',
})
  .middleware([authMiddleware])
  .inputValidator((data: { oldPassword: string; newPassword: string }) => data)
  .handler(async ({ context, data }) => {
    const { user } = context
    const { oldPassword, newPassword } = data

    const userData = await db.query.users.findFirst({
      where: (userTable) => eq(userTable.id, user?.id ?? ''),
    })

    const isValidPassword = await bcrypt.compare(
      oldPassword,
      userData?.passwordHash ?? '',
    )

    if (!isValidPassword) {
      throw new Error('Trenutna lozinka nije ispravna')
    }

    const passwordHash = await bcrypt.hash(newPassword, 10)

    const [updatedUser] = await db
      .update(users)
      .set({ passwordHash })
      .where(eq(users.id, user?.id ?? ''))
      .returning()

    const { passwordHash: _, ...userWithoutPassword } = updatedUser

    return { user: userWithoutPassword }
  })
