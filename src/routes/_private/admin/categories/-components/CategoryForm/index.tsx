import { useController, useFormContext } from 'react-hook-form'
import type { CategorySchema } from '../zod-schema'
import { Button } from '@/components/custom/Button'
import { FormField } from '@/components/custom/FormField'
import { DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useGetAllCategories } from '@/api/categories/queries'
import { Select } from '@/components/custom/Select'

interface CategoryFormProps {
  onFormSubmit: (data: CategorySchema) => void
  isSubmitting: boolean
  type: 'create' | 'edit'
}

export const CategoryForm = ({
  onFormSubmit,
  isSubmitting,
  type,
}: CategoryFormProps) => {
  const { data: categories } = useGetAllCategories()

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useFormContext<CategorySchema>()

  const {
    field: { onChange, value: parentCategoryId },
  } = useController({ name: 'parentId', control })

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onFormSubmit)}>
      <FormField
        required
        label="Naziv kategorije"
        placeholder="Unesite naziv kategorije"
        error={errors.name?.message}
        {...register('name')}
      />
      <FormField
        required
        label="Slug kategorije"
        placeholder="Unesite slug kategorije"
        error={errors.slug?.message}
        {...register('slug')}
      />
      <Select
        options={categories ?? []}
        label="Nadređena kategorija"
        placeholder="Izaberite nadređenu kategoriju"
        value={parentCategoryId ?? null}
        keys={{ label: 'name', value: 'id' }}
        onSelect={(category) => onChange(category?.id ?? null)}
      />
      <div>
        <Label className="mb-2">Opis kategorije</Label>
        <Textarea
          placeholder="Unesite opis kategorije"
          className="h-30 resize-none"
          {...register('description')}
        />
      </div>
      <DialogFooter>
        <Button variant="outline" type="button" onClick={() => reset()}>
          Poništi
        </Button>
        <Button
          type="submit"
          loading={{
            state: isSubmitting,
            text: type === 'create' ? 'Kreiranje...' : 'Izmena...',
          }}
        >
          {type === 'create' ? 'Sacuvaj' : 'Izmeni'}
        </Button>
      </DialogFooter>
    </form>
  )
}
