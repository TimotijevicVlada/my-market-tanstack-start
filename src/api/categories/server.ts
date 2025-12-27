import { createServerFn } from '@tanstack/react-start'
import { count, desc, eq, getTableColumns, ilike, or } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import type { CreateCategoryPayload, GetCategoriesParams } from './types'
import { db } from '@/db'
import { categories } from '@/db/schema'
import { requireAdminMiddleware } from '@/api/middleware'

export const getCategories = createServerFn({
  method: 'GET',
}).handler(async () => {
  return await db.query.categories.findMany({
    orderBy: (category) => [desc(category.createdAt)],
    where: (category, { isNull }) => isNull(category.parentId),
  })
})

export const getPagedCategories = createServerFn({
  method: 'POST',
})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: GetCategoriesParams) => data)
  .handler(async ({ data }) => {
    const { page, limit, keyword } = data
    const trimmedKeyword = keyword?.trim()
    const hasKeyword = trimmedKeyword !== ''

    const offset = (page - 1) * limit

    const totalQuery = db.select({ count: count() }).from(categories)
    if (hasKeyword) {
      totalQuery.where(
        or(
          ilike(categories.name, `%${trimmedKeyword}%`),
          ilike(categories.slug, `%${trimmedKeyword}%`),
        ),
      )
    }
    const [totalResult] = await totalQuery
    const total = totalResult.count

    const parentCategory = alias(categories, 'parent_category')
    const query = db
      .select({
        ...getTableColumns(categories),
        parentName: parentCategory.name,
      })
      .from(categories)
      .leftJoin(parentCategory, eq(categories.parentId, parentCategory.id))

    if (hasKeyword) {
      query.where(
        or(
          ilike(categories.name, `%${trimmedKeyword}%`),
          ilike(categories.slug, `%${trimmedKeyword}%`),
        ),
      )
    }

    const result = await query
      .orderBy(desc(categories.createdAt))
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

export const createCategory = createServerFn({
  method: 'POST',
})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: CreateCategoryPayload) => data)
  .handler(async ({ data }) => {
    const [category] = await db
      .insert(categories)
      .values({
        name: data.name,
        slug: data.slug,
        description: data.description,
        parentId: data.parentId || null,
      })
      .returning()

    return category
  })
