import type { Product, ProductStatusFilter } from '@/api/products/types'

type ProductColumn = {
  label: string
  key: keyof Product | 'actions' | 'order'
  options?: React.ComponentProps<'td'>
  hasSort?: boolean
}

export const productsColumns: Array<ProductColumn> = [
  { label: '#', key: 'order' },
  { label: 'Status', key: 'status', hasSort: true },
  { label: 'Naziv', key: 'name', hasSort: true },
  { label: 'Slug', key: 'slug', hasSort: true },
  { label: 'Cena', key: 'price', hasSort: true },
  { label: 'Jedinica', key: 'unit', hasSort: true },
  { label: 'Količina', key: 'stockQty', hasSort: true },
  { label: 'Minimalna količina', key: 'lowStockThreshold', hasSort: true },
  { label: 'SKU', key: 'sku' },
  { label: 'Kategorija', key: 'categoryId' },
  { label: 'Kreirano', key: 'createdAt', hasSort: true },
  { label: 'Ažurirano', key: 'updatedAt', hasSort: true },
  { label: 'Akcije', key: 'actions', options: { className: 'text-right' } },
]

export const statusBadgeConfig = {
  draft: { label: 'Nacrt', className: 'bg-yellow-500' },
  published: { label: 'Objavljen', className: 'bg-green-500' },
  archived: { label: 'Arhiviran', className: 'bg-muted-foreground' },
} as const

export const statusFilterOptions: Array<{
  id: ProductStatusFilter
  label: string
}> = [
  { id: 'draft', label: 'Nacrt' },
  { id: 'published', label: 'Objavljen' },
  { id: 'archived', label: 'Arhiviran' },
]
