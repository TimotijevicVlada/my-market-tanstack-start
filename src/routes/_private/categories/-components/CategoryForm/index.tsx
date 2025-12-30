import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useController, useFormContext } from 'react-hook-form'
import type { CategorySchema } from '../zod-schema'
import { Button } from '@/components/custom/Button'
import { FormField } from '@/components/custom/FormField'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { useGetAllCategories } from '@/api/categories/queries'
import { cn } from '@/lib/utils'

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
  const [dropdownOpen, setDropdownOpen] = useState(false)

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
      <div>
        <Label className="mb-2">Nadređena kategorija</Label>
        <Popover
          open={dropdownOpen}
          onOpenChange={(open) => setDropdownOpen(open)}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={dropdownOpen}
              className="w-full justify-between"
              type="button"
            >
              {parentCategoryId ? (
                categories?.find((category) => category.id === parentCategoryId)
                  ?.name
              ) : (
                <span className="text-muted-foreground font-normal">
                  Izaberite kategoriju...
                </span>
              )}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
            <Command>
              <CommandInput
                placeholder="Pretražite kategoriju..."
                className="h-9"
              />
              <CommandList
                className="max-h-[300px]"
                onWheel={(e) => e.stopPropagation()}
              >
                <CommandEmpty>Nema kategorija.</CommandEmpty>
                <CommandGroup>
                  {categories?.map((category) => (
                    <CommandItem
                      key={category.id}
                      value={category.name}
                      onSelect={(currentValue) => {
                        const selectedCategory = categories.find(
                          (cat) => cat.name === currentValue,
                        )
                        onChange(
                          selectedCategory?.id === parentCategoryId
                            ? ''
                            : selectedCategory?.id,
                        )
                        setDropdownOpen(false)
                      }}
                    >
                      {category.name}
                      <Check
                        className={cn(
                          'ml-auto',
                          parentCategoryId === category.id
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
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
          Ponisti
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
