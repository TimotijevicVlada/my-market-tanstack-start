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
import type { GetUsersParams } from './types'
import type {
  // CreateUserSchema,
  EditUserSchema,
} from '@/routes/_private/admin/users/-components/zod-schema'
import { db } from '@/db'
import { user } from '@/db/schema/better-auth'
// import { sellers } from '@/db/schema/sellers'
// import { products } from '@/db/schema/products'
import { requireAdminMiddleware } from '@/lib/middleware'

export const getAllUsers = createServerFn({
  method: 'GET',
})
  .middleware([requireAdminMiddleware])
  .handler(async () => {
    const usersList = await db.query.user.findMany({
      orderBy: (usersTable) => [asc(usersTable.name)],
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
          ilike(user.name, `%${trimmedKeyword}%`),
          ilike(user.email, `%${trimmedKeyword}%`),
        ),
      )
    }
    if (status) {
      conditions.push(eq(user.isActive, status === 'active' ? true : false))
    }
    if (role) {
      conditions.push(eq(user.role, role))
    }

    const totalQuery = db.select({ count: count() }).from(user)

    if (conditions.length > 0) {
      totalQuery.where(and(...conditions))
    }
    const [totalResult] = await totalQuery
    const total = totalResult.count

    const query = db
      .select({
        ...getTableColumns(user),
        // productCount: count(products.id).as('product_count'),
      })
      .from(user)
      // .leftJoin(sellers, eq(sellers.userId, user.id))
      // .leftJoin(products, eq(products.sellerId, sellers.id))
      .groupBy(user.id)

    if (conditions.length > 0) {
      query.where(and(...conditions))
    }

    const orderByColumn = user[sort.key]
    const result = await query
      .orderBy(
        sort.order === 'asc' ? asc(orderByColumn) : desc(orderByColumn),
        desc(user.id),
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

    const userData = await db.query.user.findFirst({
      where: (userTable) => eq(userTable.id, userId),
    })

    if (!userData) {
      throw new Error('Korisnik nije pronađen')
    }

    const [updatedUser] = await db
      .update(user)
      .set({
        isActive: !userData.isActive,
      })
      .where(eq(user.id, userId))
      .returning()

    return updatedUser
  })

// export const createUser = createServerFn({
//   method: 'POST',
// })
//   .middleware([requireAdminMiddleware])
//   .inputValidator((data: CreateUserSchema) => data)
//   .handler(async ({ data }) => {
//     const existingUserByEmail = await db.query.user.findFirst({
//       where: (userTable) => eq(userTable.email, data.email),
//     })

//     if (existingUserByEmail) {
//       throw new Error('Email je već zauzet')
//     }

//     const existingUserByUsername = await db.query.user.findFirst({
//       where: (userTable) => eq(userTable.name, data.username),
//     })

//     if (existingUserByUsername) {
//       throw new Error('Korisničko ime je već zauzeto')
//     }

//     const [userData] = await db
//       .insert(user)
//       .values(data)
//       .returning()

//     return {
//       user: userData,
//     }
//   })

export const deleteUser = createServerFn({
  method: 'POST',
})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    const { userId } = data

    const [deletedUser] = await db
      .delete(user)
      .where(eq(user.id, userId))
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

    const existingUserByEmail = await db.query.user.findFirst({
      where: (userTable) => eq(userTable.email, data.email),
    })

    if (existingUserByEmail && existingUserByEmail.id !== userId) {
      throw new Error('Email je već zauzet')
    }

    const existingUserByUsername = await db.query.user.findFirst({
      where: (userTable) => eq(userTable.name, data.name),
    })

    if (existingUserByUsername && existingUserByUsername.id !== userId) {
      throw new Error('Korisničko ime je već zauzeto')
    }

    const [updatedUser] = await db
      .update(user)
      .set({
        name: data.name,
        email: data.email,
        role: data.role,
      })
      .where(eq(user.id, userId))
      .returning()

    return updatedUser
  })
