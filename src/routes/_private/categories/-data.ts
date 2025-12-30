import type { Category, CategoryStatus } from '@/api/categories/types'

type Column = {
  label: string
  key: keyof Category | 'actions' | 'order' | 'parentName'
  options?: React.ComponentProps<'td'>
}

export const categoriesColumns: Array<Column> = [
  { label: '#', key: 'order' },
  { label: 'Status', key: 'isActive' },
  { label: 'Naziv', key: 'name' },
  { label: 'Slug', key: 'slug' },
  { label: 'Nadređena kategorija', key: 'parentName' },
  { label: 'Opis', key: 'description' },
  { label: 'Kreirano', key: 'createdAt' },
  { label: 'Ažurirano', key: 'updatedAt' },
  { label: 'Akcije', key: 'actions', options: { className: 'text-right' } },
]

export const statusFilterOptions: Array<{
  id: CategoryStatus
  label: string
}> = [
  { id: 'active', label: 'Aktivne' },
  { id: 'inactive', label: 'Neaktivne' },
]
