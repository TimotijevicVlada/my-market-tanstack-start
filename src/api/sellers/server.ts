import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  or,
  sql,
} from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'
import { requireAdminMiddleware } from '../middleware'
import type {
  CreateSellerPayload,
  GetSellerParams,
  UpdateSellerPayload,
  VerifySellerParams,
} from './types'
import { db } from '@/db'
import { sellerCategories, sellers, users } from '@/db/schema'

export const getPagedSellers = createServerFn({
  method: 'POST',
})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: GetSellerParams) => data)
  .handler(async ({ data }) => {
    const { page, limit, keyword } = data
    const trimmedKeyword = keyword?.trim()
    const hasKeyword = trimmedKeyword !== ''

    const offset = (page - 1) * limit

    const conditions = [
      ...(hasKeyword
        ? [
            or(
              ilike(sellers.displayName, `%${trimmedKeyword}%`),
              ilike(sellers.email, `%${trimmedKeyword}%`),
              ilike(sellers.phone, `%${trimmedKeyword}%`),
              ilike(sellers.website, `%${trimmedKeyword}%`),
              ilike(sellers.country, `%${trimmedKeyword}%`),
              ilike(sellers.city, `%${trimmedKeyword}%`),
              ilike(sellers.address, `%${trimmedKeyword}%`),
              ilike(sellers.postalCode, `%${trimmedKeyword}%`),
            ),
          ]
        : []),
    ]

    const totalQuery = db.select({ count: count() }).from(sellers)

    if (conditions.length > 0) {
      totalQuery.where(and(...conditions))
    }

    const [totalResult] = await totalQuery
    const total = totalResult.count

    const query = db
      .select({
        ...getTableColumns(sellers),
        username: users.username,
        categories: sql<
          Array<string>
        >`COALESCE(array_agg(${sellerCategories.categoryId}) FILTER (WHERE ${sellerCategories.categoryId} IS NOT NULL), ARRAY[]::uuid[])`.as(
          'categories',
        ),
      })
      .from(sellers)
      .leftJoin(users, eq(sellers.userId, users.id))
      .leftJoin(sellerCategories, eq(sellers.id, sellerCategories.sellerId))
      .groupBy(sellers.id, users.id, users.username)

    if (conditions.length > 0) {
      query.where(and(...conditions))
    }

    const result = await query
      .orderBy(desc(sellers.createdAt), desc(sellers.id))
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
    const { sellerId, status, verificationNote } = data

    const [verifiedSeller] = await db
      .update(sellers)
      .set({
        status,
        verificationNote: verificationNote ?? null,
      })
      .where(eq(sellers.id, sellerId))
      .returning()

    return verifiedSeller
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

export const createSeller = createServerFn({
  method: 'POST',
})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: CreateSellerPayload) => data)
  .handler(async ({ data }) => {
    const { categories, ...sellerData } = data

    const [seller] = await db.insert(sellers).values(sellerData).returning()

    const [categoriesResult] = await db
      .insert(sellerCategories)
      .values(
        categories.map((categoryId) => ({
          sellerId: seller.id,
          categoryId,
        })),
      )
      .returning()

    return {
      seller,
      categories: categoriesResult,
    }
  })

export const updateSeller = createServerFn({
  method: 'POST',
})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: UpdateSellerPayload) => data)
  .handler(async ({ data }) => {
    const { sellerId, categories, ...sellerData } = data

    // If enything fails, the transaction will be rolled back
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
          categories.map((categoryId) => ({
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
