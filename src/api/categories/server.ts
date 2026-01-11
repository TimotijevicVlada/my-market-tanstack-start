import { createServerFn } from '@tanstack/react-start'
import {
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  isNull,
  or,
} from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import type { GetCategoriesParams } from './types'
import type { CategorySchema } from '@/routes/_private/admin/categories/-components/zod-schema'
import { db } from '@/db'
import { categories } from '@/db/schema'
import { requireAdminMiddleware } from '@/api/middleware'

export const getCategories = createServerFn({
  method: 'GET',
})
  .inputValidator((data: { rootCategoriesOnly: boolean } | undefined) => data)
  .handler(async ({ data }) => {
    const { rootCategoriesOnly } = data ?? {}

    const result = await db.query.categories.findMany({
      orderBy: (category) => [desc(category.createdAt), desc(category.id)],
      ...(rootCategoriesOnly && {
        where: (category) => isNull(category.parentId),
      }),
    })

    return result
  })

export const getPagedCategories = createServerFn({
  method: 'POST',
})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: GetCategoriesParams) => data)
  .handler(async ({ data }) => {
    const { page, limit, keyword, status, sort } = data
    const trimmedKeyword = keyword?.trim()
    const hasKeyword = trimmedKeyword !== ''

    const offset = (page - 1) * limit

    const parentCategory = alias(categories, 'parent_category')

    const conditions = []
    if (hasKeyword) {
      conditions.push(
        or(
          ilike(categories.name, `%${trimmedKeyword}%`),
          ilike(categories.slug, `%${trimmedKeyword}%`),
          ilike(parentCategory.name, `%${trimmedKeyword}%`),
        ),
      )
    }
    if (status) {
      conditions.push(
        eq(categories.isActive, status === 'active' ? true : false),
      )
    }

    const totalQuery = db
      .select({ count: count() })
      .from(categories)
      .leftJoin(parentCategory, eq(categories.parentId, parentCategory.id))
    if (conditions.length > 0) {
      totalQuery.where(and(...conditions))
    }

    const [totalResult] = await totalQuery
    const total = totalResult.count

    const query = db
      .select({
        ...getTableColumns(categories),
        parentName: parentCategory.name,
      })
      .from(categories)
      .leftJoin(parentCategory, eq(categories.parentId, parentCategory.id))

    if (conditions.length > 0) {
      query.where(and(...conditions))
    }

    const orderByColumn =
      sort.key === 'parentName' ? parentCategory.name : categories[sort.key]
    const result = await query
      .orderBy(
        sort.order === 'asc' ? asc(orderByColumn) : desc(orderByColumn),
        desc(categories.id),
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

export const toggleCategoryActiveStatus = createServerFn({
  method: 'POST',
})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: { categoryId: string }) => data)
  .handler(async ({ data }) => {
    const { categoryId } = data

    const category = await db.query.categories.findFirst({
      where: (categoriesTable) => eq(categoriesTable.id, categoryId),
    })

    if (!category) {
      throw new Error('Kategorija nije pronađena')
    }

    const [updatedCategory] = await db
      .update(categories)
      .set({
        isActive: !category.isActive,
      })
      .where(eq(categories.id, categoryId))
      .returning()

    return updatedCategory
  })

export const createCategory = createServerFn({
  method: 'POST',
})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: CategorySchema) => data)
  .handler(async ({ data }) => {
    const existingSlug = await db.query.categories.findFirst({
      where: (categoryTable) => eq(categoryTable.slug, data.slug),
    })

    if (existingSlug) {
      throw new Error('Slug je već zauzet')
    }

    const [category] = await db.insert(categories).values(data).returning()

    return category
  })

export const editCategory = createServerFn({
  method: 'POST',
})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: CategorySchema & { categoryId: string }) => data)
  .handler(async ({ data }) => {
    const { categoryId, ...categoryData } = data

    const existingSlug = await db.query.categories.findFirst({
      where: (categoryTable) => eq(categoryTable.slug, categoryData.slug),
    })

    if (existingSlug && existingSlug.id !== categoryId) {
      throw new Error('Slug je već zauzet')
    }

    if (categoryData.parentId === categoryId) {
      throw new Error('Kategorija ne može biti parent kategorija samoj sebi')
    }

    const [updatedCategory] = await db
      .update(categories)
      .set(categoryData)
      .where(eq(categories.id, categoryId))
      .returning()

    return updatedCategory
  })

export const deleteCategory = createServerFn({
  method: 'POST',
})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: { categoryId: string }) => data)
  .handler(async ({ data }) => {
    const { categoryId } = data

    const [deletedCategory] = await db
      .delete(categories)
      .where(eq(categories.id, categoryId))
      .returning()

    return deletedCategory
  })
