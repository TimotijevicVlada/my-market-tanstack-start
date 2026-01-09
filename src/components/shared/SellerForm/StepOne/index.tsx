import { ChevronRight } from 'lucide-react'
import { useController } from 'react-hook-form'
import type { UseFormReturn } from 'react-hook-form'
import type { FirstStepSchema } from './zod-schema-step-one'
import { Button } from '@/components/custom/Button'
import { DialogFooter } from '@/components/ui/dialog'
import { Select } from '@/components/custom/Select'
import { FormField } from '@/components/custom/FormField'
import { Textarea } from '@/components/custom/Textarea'
import { useGetAllUsers } from '@/api/users/queries'
import { Multiselect } from '@/components/custom/Multiselect'
import { useGetAllCategories } from '@/api/categories/queries'

interface StepOneProps {
  setActiveStep: (step: number) => void
  firstStepMethods: UseFormReturn<FirstStepSchema>
  userId?: string
}

export const StepOne = ({
  setActiveStep,
  firstStepMethods,
  userId,
}: StepOneProps) => {
  const { data: usersList } = useGetAllUsers()
  const { data: categoriesList } = useGetAllCategories()

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    reset,
  } = firstStepMethods

  const { field: userIfField } = useController({
    control,
    name: 'userId',
  })

  const { field: categoriesField } = useController({
    control,
    name: 'categories',
  })

  const onFormSubmit = () => {
    setActiveStep(2)
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onFormSubmit)}>
      {!userId && (
        <Select
          required
          options={usersList ?? []}
          label="Korisnik"
          placeholder="Izaberite korisnika"
          value={userIfField.value}
          keys={{ label: 'username', value: 'id' }}
          onSelect={(selectedValue) => userIfField.onChange(selectedValue?.id)}
          error={errors.userId?.message}
        />
      )}
      <FormField
        required
        label="Naziv prodavca"
        placeholder="Unesite naziv prodavca"
        {...register('displayName')}
        error={errors.displayName?.message}
      />
      <Multiselect
        required
        options={categoriesList ?? []}
        keys={{ label: 'name', value: 'id' }}
        placeholder="Izaberite kategorije"
        label="Kategorije"
        values={categoriesField.value}
        onValuesChange={(selectedValues) =>
          categoriesField.onChange(selectedValues)
        }
        error={errors.categories?.message}
      />
      <Textarea
        label="Opis prodavca"
        placeholder="Primer: Prodavnica koja se bavi prodajom televizora..."
        {...register('description')}
      />
      <DialogFooter className="flex justify-end gap-2">
        <Button variant="ghost" type="button" onClick={() => reset()}>
          Poništi
        </Button>
        <Button variant="ghost" type="submit">
          Dalje
          <ChevronRight />
        </Button>
      </DialogFooter>
    </form>
  )
}
