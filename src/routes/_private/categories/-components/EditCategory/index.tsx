import { useEffect, useState } from 'react'
import { PencilIcon } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { categorySchema, defaultValues } from '../zod-schema'
import { CategoryForm } from '../CategoryForm'
import type { Category, GetCategoriesParams } from '@/api/categories/types'
import type { CategorySchema } from '../zod-schema'
import { useEditCategory } from '@/api/categories/queries'
import { Button } from '@/components/custom/Button'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tooltip } from '@/components/custom/Tooltip'

interface EditCategoryProps {
  params: GetCategoriesParams
  category: Category
}

export const EditCategory = ({ params, category }: EditCategoryProps) => {
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null)

  const methods = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultValues,
  })

  const { mutate: editCategory, isPending } = useEditCategory(params)

  const onFormSubmit = (data: CategorySchema) => {
    editCategory(
      { data: { ...data, categoryId: category.id } },
      {
        onSuccess: () => {
          setCategoryToEdit(null)
        },
      },
    )
  }

  useEffect(() => {
    if (categoryToEdit) {
      methods.reset(categoryToEdit)
    }
  }, [categoryToEdit])

  return (
    <>
      <Tooltip title="Izmena kategorije">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCategoryToEdit(category)}
          disabled={!category.isActive}
        >
          <PencilIcon
            className={`${!category.isActive ? 'text-muted-foreground' : 'text-orange-500'}`}
          />
        </Button>
      </Tooltip>
      <Dialog
        open={!!categoryToEdit}
        onOpenChange={() => setCategoryToEdit(null)}
      >
        <DialogContent className="max-w-sm sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Izmena kategorije</DialogTitle>
            <Separator />
          </DialogHeader>
          <FormProvider {...methods}>
            <CategoryForm
              onFormSubmit={onFormSubmit}
              isSubmitting={isPending}
              type="edit"
            />
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  )
}
