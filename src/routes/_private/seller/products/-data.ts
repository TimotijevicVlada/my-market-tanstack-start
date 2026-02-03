import type { Product } from '@/api/products/types'

type ProductColumn = {
  label: string
  key: keyof Product | 'actions' | 'order'
  options?: React.ComponentProps<'td'>
}

export const productsColumns: Array<ProductColumn> = [
  { label: '#', key: 'order' },
  { label: 'Status', key: 'status' },
  { label: 'Naziv', key: 'name' },
  { label: 'Slug', key: 'slug' },
  { label: 'Cena', key: 'price' },
  { label: 'Jedinica', key: 'unit' },
  { label: 'Količina', key: 'stockQty' },
  { label: 'Minimalna količina', key: 'lowStockThreshold' },
  { label: 'SKU', key: 'sku' },
  { label: 'Kategorija', key: 'categoryId' },
  { label: 'Kreirano', key: 'createdAt' },
  { label: 'Ažurirano', key: 'updatedAt' },
  { label: 'Akcije', key: 'actions', options: { className: 'text-right' } },
]

export const statusBadgeConfig = {
  draft: { label: 'Nacrt', className: 'bg-yellow-500' },
  published: { label: 'Objavljen', className: 'bg-green-500' },
  archived: { label: 'Arhiviran', className: 'bg-muted-foreground' },
} as const
