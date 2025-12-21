import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import { categories } from '@/db/schema'
import { requireAdminMiddleware } from '@/api/middleware'

interface CreateCategoryPayload {
  name: string
  slug: string
  parentId: string | null
  description: string
}

export const getCategories = createServerFn({
  method: 'GET',
}).handler(async () => {
  return await db.query.categories.findMany({
    orderBy: (category, { desc }) => [desc(category.createdAt)],
    where: (category, { isNull }) => isNull(category.parentId),
  })
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
