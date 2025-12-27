export interface GetCategoriesParams {
  page: number
  limit: number
  keyword?: string
}

export interface CreateCategoryPayload {
  name: string
  slug: string
  parentId: string | null
  description: string
}
