import {
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  or,
  sql,
} from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'
import { createSellerFn } from './shared'
import type {
  CreateSellerPayload,
  GetSellerParams,
  UpdateMySellerPayload,
  UpdateSellerPayload,
  VerifySellerParams,
} from './types'
import { db } from '@/db'

import { betterAuthMiddleware, requireAdminMiddleware } from '@/lib/middleware'
import { sellers } from '@/db/schema/sellers'
import { user } from '@/db/schema/better-auth'
import { sellerCategories } from '@/db/schema/seller-categories'
import { categories } from '@/db/schema/categories'

export const getPagedSellers = createServerFn({
  method: 'POST',
})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: GetSellerParams) => data)
  .handler(async ({ data }) => {
    const { page, limit, keyword, status, verificationStatus, sort } = data
    const trimmedKeyword = keyword?.trim()
    const hasKeyword = trimmedKeyword !== ''

    const offset = (page - 1) * limit

    const conditions = []
    if (hasKeyword) {
      conditions.push(
        or(
          ilike(sellers.displayName, `%${trimmedKeyword}%`),
          ilike(sellers.email, `%${trimmedKeyword}%`),
          ilike(sellers.phone, `%${trimmedKeyword}%`),
          ilike(sellers.website, `%${trimmedKeyword}%`),
          ilike(sellers.country, `%${trimmedKeyword}%`),
          ilike(sellers.city, `%${trimmedKeyword}%`),
          ilike(sellers.address, `%${trimmedKeyword}%`),
          ilike(sellers.postalCode, `%${trimmedKeyword}%`),
          ilike(user.name, `%${trimmedKeyword}%`),
        ),
      )
    }
    if (status) {
      conditions.push(eq(sellers.isActive, status === 'active' ? true : false))
    }
    if (verificationStatus) {
      conditions.push(eq(sellers.status, verificationStatus))
    }

    const totalQuery = db
      .select({ count: count(sellers.id) })
      .from(sellers)
      .leftJoin(user, eq(sellers.userId, user.id))

    if (conditions.length > 0) {
      totalQuery.where(and(...conditions))
    }

    const [totalResult] = await totalQuery
    const total = totalResult.count

    const query = db
      .select({
        ...getTableColumns(sellers),
        username: user.name,
        categories: sql<
          Array<{ id: string; name: string }>
        >`COALESCE(json_agg(json_build_object('id', ${sellerCategories.categoryId}, 'name', ${categories.name})) FILTER (WHERE ${sellerCategories.categoryId} IS NOT NULL), '[]'::json)`.as(
          'categories',
        ),
      })
      .from(sellers)
      .leftJoin(user, eq(sellers.userId, user.id))
      .leftJoin(sellerCategories, eq(sellers.id, sellerCategories.sellerId))
      .leftJoin(
        categories,
        eq(sellerCategories.categoryId, categories.id),
      )
      .groupBy(sellers.id, user.id, user.name)

    if (conditions.length > 0) {
      query.where(and(...conditions))
    }

    const orderByColumn =
      sort.key === 'username' ? user.name : sellers[sort.key]
    const result = await query
      .orderBy(
        sort.order === 'asc' ? asc(orderByColumn) : desc(orderByColumn),
        desc(sellers.id),
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

export const getMySeller = createServerFn({
  method: 'GET',
})
  .middleware([betterAuthMiddleware])
  .handler(async ({ context }) => {
    const { user: sessionUser } = context

    const seller = await db.query.sellers.findFirst({
      where: (sellersTable) => eq(sellersTable.userId, sessionUser.id),
    })

    return seller
  })

export const updateMySeller = createServerFn({
  method: 'POST',
})
  .middleware([betterAuthMiddleware])
  .inputValidator((data: UpdateMySellerPayload) => data)
  .handler(async ({ data }) => {
    const { sellerId, ...sellerData } = data
    const [updatedSeller] = await db
      .update(sellers)
      .set(sellerData)
      .where(eq(sellers.id, sellerId))
      .returning()

    return updatedSeller
  })

export const toggleSellerActiveStatus = createServerFn({
  method: 'POST',
})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: { sellerId: string }) => data)
  .handler(async ({ data }) => {
    const { sellerId } = data

    const seller = await db.query.sellers.findFirst({
      where: (sellersTable) => eq(sellersTable.id, sellerId),
    })

    if (!seller) {
      throw new Error('Prodavac nije pronađen')
    }

    const [updatedSeller] = await db
      .update(sellers)
      .set({
        isActive: !seller.isActive,
      })
      .where(eq(sellers.id, sellerId))
      .returning()

    return updatedSeller
  })

export const verifySeller = createServerFn({
  method: 'POST',
})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: VerifySellerParams) => data)
  .handler(async ({ data }) => {
    const { sellerId, status, verificationNote, userId } = data

    const result = await db.transaction(async (tx) => {
      if (status === 'approved') {
        await tx
          .update(user)
          .set({ role: 'seller' })
          .where(eq(user.id, userId))
      }

      const [verifiedSeller] = await tx
        .update(sellers)
        .set({
          status,
          verificationNote: verificationNote ?? null,
        })
        .where(eq(sellers.id, sellerId))
        .returning()

      return verifiedSeller
    })

    // TODO: Send emal and notification to the seller

    return result
  })

export const deleteSeller = createServerFn({
  method: 'POST',
})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: { sellerId: string }) => data)
  .handler(async ({ data }) => {
    const { sellerId } = data

    const [deletedSeller] = await db
      .delete(sellers)
      .where(eq(sellers.id, sellerId))
      .returning()

    return deletedSeller
  })

export const createSellerByAdmin = createServerFn({
  method: 'POST',
})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: CreateSellerPayload) => data)
  .handler(async ({ data }) => {
    return createSellerFn(data)
  })

export const createSellerByUser = createServerFn({
  method: 'POST',
})
  .middleware([betterAuthMiddleware])
  .inputValidator((data: CreateSellerPayload) => data)
  .handler(async ({ context, data }) => {
    const { user: sessionUser } = context

    return createSellerFn({ ...data, userId: sessionUser.id })
  })

export const updateSeller = createServerFn({
  method: 'POST',
})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: UpdateSellerPayload) => data)
  .handler(async ({ data }) => {
    const { sellerId, categories: categoryIds, ...sellerData } = data

    const result = await db.transaction(async (tx) => {
      const [updatedSeller] = await tx
        .update(sellers)
        .set(sellerData)
        .where(eq(sellers.id, sellerId))
        .returning()

      await tx
        .delete(sellerCategories)
        .where(eq(sellerCategories.sellerId, sellerId))

      const [categoriesResult] = await tx
        .insert(sellerCategories)
        .values(
          categoryIds.map((categoryId) => ({
            sellerId,
            categoryId,
          })),
        )
        .returning()

      return {
        seller: updatedSeller,
        categories: categoriesResult,
      }
    })

    return result
  })
