import { Check, ChevronRight, Store } from 'lucide-react'
import { useController } from 'react-hook-form'
import type { Dispatch, SetStateAction } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { FirstStepSchema } from './step-one-schema'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/custom/Textarea'
import { FormField } from '@/components/custom/FormField'
import { useGetAllCategories } from '@/api/categories/queries'
import { cn } from '@/lib/utils'
import { DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/custom/Button'
import { FieldDescription } from '@/components/ui/field'
import { SectionHead } from '@/components/custom/SectionHead'

interface StepOneProps {
  firstStepMethods: UseFormReturn<FirstStepSchema>
  setActiveStep: Dispatch<SetStateAction<number>>
}

export const StepOne = ({ firstStepMethods, setActiveStep }: StepOneProps) => {
  const { data: categoriesList } = useGetAllCategories()

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    reset,
  } = firstStepMethods

  const { field: categoriesField } = useController({
    control,
    name: 'categories',
  })

  const toggleCategory = (category: string) => {
    categoriesField.onChange(
      categoriesField.value.includes(category)
        ? categoriesField.value.filter((c) => c !== category)
        : [...categoriesField.value, category],
    )
  }

  const onFormSubmit = () => {
    setActiveStep(2)
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onFormSubmit)}>
      <SectionHead
        Icon={Store}
        title="Opšte informacije"
        description="Unesite osnovne podatke o prodavnici"
        className="pb-2"
      />
      <div className="flex flex-col gap-5">
        <FormField
          required
          label="Naziv prodavca"
          placeholder="Unesite naziv prodavca"
          {...register('displayName')}
          error={errors.displayName?.message}
        />

        <div>
          <Label className="mb-2">
            Kategorije <span className="text-destructive">*</span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {categoriesList?.map((category) => (
              <Badge
                key={category.id}
                variant={
                  categoriesField.value.includes(category.id)
                    ? 'default'
                    : 'outline'
                }
                className={cn(
                  'cursor-pointer text-sm py-1!',
                  categoriesField.value.includes(category.id)
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent',
                )}
                onClick={() => toggleCategory(category.id)}
              >
                {categoriesField.value.includes(category.id) && (
                  <Check className="mr-1 size-3" />
                )}
                {category.name}
              </Badge>
            ))}
          </div>
          {errors.categories?.message && (
            <FieldDescription className="text-destructive">
              {errors.categories.message}
            </FieldDescription>
          )}
        </div>

        <Textarea
          label="Opis prodavca"
          placeholder="Primer: Prodavnica koja se bavi prodajom televizora..."
          {...register('description')}
        />

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="ghost" type="button" onClick={() => reset()}>
            Poništi
          </Button>
          <Button type="submit">
            Dalje
            <ChevronRight />
          </Button>
        </DialogFooter>
      </div>
    </form>
  )
}
