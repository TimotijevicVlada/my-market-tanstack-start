import { useEffect, useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { categorySchema, defaultValues } from '../zod-schema'
import { CategoryForm } from '../CategoryForm'
import type { CategorySchema } from '../zod-schema'
import { useCreateCategory } from '@/api/categories/queries'
import { Button } from '@/components/custom/Button'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tooltip } from '@/components/custom/Tooltip'

interface CreateSubcategoryProps {
  parentCategoryId: string
}

export const CreateSubcategory = ({
  parentCategoryId,
}: CreateSubcategoryProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const methods = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultValues,
  })

  const { reset } = methods

  const { mutate: createCategory, isPending } = useCreateCategory()

  const onFormSubmit = (data: CategorySchema) => {
    createCategory(
      { data },
      {
        onSuccess: () => {
          reset()
          setIsOpen(false)
        },
      },
    )
  }

  useEffect(() => {
    if (parentCategoryId && isOpen) {
      methods.setValue('parentId', parentCategoryId)
    }
  }, [parentCategoryId, isOpen])

  return (
    <>
      <Tooltip title="Dodaj podkategoriju">
        <Button variant="ghost" size="icon-sm" onClick={() => setIsOpen(true)}>
          <PlusIcon className="text-green-500" />
        </Button>
      </Tooltip>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent className="max-w-sm sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dodavanje podkategorije</DialogTitle>
            <Separator />
          </DialogHeader>
          <FormProvider {...methods}>
            <CategoryForm
              onFormSubmit={onFormSubmit}
              isSubmitting={isPending}
              type="create"
              createSubcategory
            />
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  )
}
