import type { categories } from '@/db/schema/categories'

export type CategoryStatus = 'active' | 'inactive'

export interface GetCategoriesParams {
  page: number
  limit: number
  keyword?: string
  status?: CategoryStatus | null
}

export interface CreateCategoryPayload {
  name: string
  slug: string
  parentId: string | null
  description: string
}

export type Category = typeof categories.$inferSelect
