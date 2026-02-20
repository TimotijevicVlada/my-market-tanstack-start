import { Save } from 'lucide-react'
import { useController, useFormContext } from 'react-hook-form'
import { SlugField } from './SlugField'
import type { CategorySchema } from '../zod-schema'
import { Button } from '@/components/custom/Button'
import { FormField } from '@/components/custom/FormField'
import { DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useGetAllCategories } from '@/api/categories/queries'
import { Select } from '@/components/custom/Select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field'
import { ResetButton } from '@/components/custom/ResetButton'

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
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = useFormContext<CategorySchema>()

  const {
    field: { onChange, value: parentCategoryId },
  } = useController({ name: 'parentId', control })

  const {
    field: { onChange: onCheckboxChange, value: featured },
  } = useController({ name: 'featured', control })

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onFormSubmit)}>
      <FormField
        required
        label="Naziv kategorije"
        placeholder="Unesite naziv kategorije"
        error={errors.name?.message}
        {...register('name')}
      />
      <SlugField />
      <Select
        options={categories ?? []}
        label="Nadređena kategorija"
        placeholder="Izaberite nadređenu kategoriju"
        value={parentCategoryId ?? null}
        keys={{ label: 'name', value: 'id' }}
        onSelect={(category) => onChange(category?.id ?? null)}
      />
      <FieldLabel>
        <Field orientation="horizontal">
          <Checkbox
            id="toggle-checkbox-2"
            checked={featured}
            onCheckedChange={onCheckboxChange}
          />
          <FieldContent>
            <FieldTitle>Istaknuta kategorija</FieldTitle>
            <FieldDescription>
              Istaknuta kategorija će biti prikazana na početnoj stranici
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
      <div>
        <Label className="mb-2">Opis kategorije</Label>
        <Textarea
          placeholder="Unesite opis kategorije"
          className="h-30 resize-none"
          {...register('description')}
        />
      </div>
      <DialogFooter>
        <ResetButton variant="outline" type="button" onClick={() => reset()} />
        <Button
          type="submit"
          loading={{
            state: isSubmitting,
            text: type === 'create' ? 'Kreiranje...' : 'Izmena...',
          }}
        >
          <Save />
          {type === 'create' ? 'Sacuvaj' : 'Izmeni'}
        </Button>
      </DialogFooter>
    </form>
  )
}
