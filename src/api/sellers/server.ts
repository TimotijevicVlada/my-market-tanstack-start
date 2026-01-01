import { count, desc, eq, getTableColumns } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'
import { requireAdminMiddleware } from '../middleware'
import type { GetSellerParams } from './types'
import { db } from '@/db'
import { sellers, users } from '@/db/schema'

export const getPagedSellers = createServerFn({})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: GetSellerParams) => data)
  .handler(async ({ data }) => {
    const { page, limit } = data
    // const trimmedKeyword = keyword?.trim()
    // const hasKeyword = trimmedKeyword !== ''

    const offset = (page - 1) * limit

    const totalQuery = db.select({ count: count() }).from(sellers)

    const [totalResult] = await totalQuery
    const total = totalResult.count

    const query = db
      .select({
        ...getTableColumns(sellers),
        username: users.username,
      })
      .from(sellers)
      .leftJoin(users, eq(sellers.userId, users.id))

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
