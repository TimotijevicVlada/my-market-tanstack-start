import type { ProductFormSchema } from '@/routes/_private/seller/products/create/-components/ProductForm/zod-schema'
import type { products } from '@/db/schema/products'

export type Product = typeof products.$inferSelect

export type CreateProductPayload = ProductFormSchema

export type UpdateProductPayload = CreateProductPayload & {
  productId: string
}

export type ProductSort = {
  key: keyof Product
  order: 'asc' | 'desc'
}
export type ProductStatusFilter = 'draft' | 'published' | 'archived'

export interface GetProductsParams {
  page: number
  limit: number
  keyword?: string
  status?: ProductStatusFilter | null
  sort: ProductSort
}

export const SORTABLE_PRODUCT_COLUMNS = [
  'id',
  'name',
  'slug',
  'status',
  'stockQty',
  'lowStockThreshold',
  'price',
  'createdAt',
  'updatedAt',
] as const

export type SortableProductColumns = (typeof SORTABLE_PRODUCT_COLUMNS)[number]

export type ProductUnit = 'piece' | 'kg' | 'g' | 'liter' | 'box'

export const formUnitToDbUnit: Record<string, ProductUnit> = {
  pcs: 'piece',
  kg: 'kg',
  g: 'g',
  l: 'liter',
  ml: 'liter',
  pack: 'piece',
  bag: 'box',
  jar: 'piece',
  tube: 'piece',
  bottle: 'piece',
  can: 'piece',
}

export const dbUnitToFormUnit: Record<ProductUnit, string> = {
  piece: 'pcs',
  kg: 'kg',
  g: 'g',
  liter: 'l',
  box: 'box',
}
