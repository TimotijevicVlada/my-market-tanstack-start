import { useController, useFormContext } from 'react-hook-form'
import type { ProductFormSchema } from '../../zod-schema'
import { useGetAllCategories } from '@/api/categories/queries'
import { Select } from '@/components/custom/Select'

export const CategorySelect = () => {
  const { data: categories } = useGetAllCategories()

  const { control } = useFormContext<ProductFormSchema>()

  const {
    field: { onChange, value: categoryId },
  } = useController({ name: 'categoryId', control })

  return (
    <Select
      options={categories ?? []}
      label="Kategorija"
      placeholder="Izaberite kategoriju"
      value={categoryId ?? null}
      keys={{ label: 'name', value: 'id' }}
      onSelect={(category) => onChange(category?.id ?? null)}
      description="Proizvod koji ima kategoriju je bolje vidljiv i lakše se pretražuje"
    />
  )
}
