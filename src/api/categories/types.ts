import type { categories } from '@/db/schema/categories'

export type CategoryStatus = 'active' | 'inactive'

export type Category = typeof categories.$inferSelect & {
  parentName: string | null
}

export type SortableCategoryColumns = keyof Category

export type CategorySort = {
  key: SortableCategoryColumns
  order: 'asc' | 'desc'
}

export interface GetCategoriesParams {
  page: number
  limit: number
  keyword?: string
  status?: CategoryStatus | null
  sort: CategorySort
}

export interface CreateCategoryPayload {
  name: string
  slug: string
  parentId: string | null
  description: string
}
