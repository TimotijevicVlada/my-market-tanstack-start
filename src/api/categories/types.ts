import type { categories } from '@/db/schema/categories'

export type CategoryStatus = 'active' | 'inactive'
export type CategorySort = {
  key: keyof Category
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

export type Category = typeof categories.$inferSelect

export type SortableCategoryColumns = Exclude<keyof Category, 'parentName'>
