import { and, count, desc, eq, getTableColumns, ilike, or } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'
import { requireAdminMiddleware } from '../middleware'
import type { GetSellerParams, VerifySellerParams } from './types'
import { db } from '@/db'
import { sellers, users } from '@/db/schema'

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
      })
      .from(sellers)
      .leftJoin(users, eq(sellers.userId, users.id))

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
