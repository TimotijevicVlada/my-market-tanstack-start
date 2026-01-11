import { useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { categorySchema, defaultValues } from '../zod-schema'
import { CategoryForm } from '../CategoryForm'
import type { GetCategoriesParams } from '@/api/categories/types'
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

interface CreateCategoryProps {
  params: GetCategoriesParams
}

export const CreateCategory = ({ params }: CreateCategoryProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const methods = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultValues,
  })

  const { reset } = methods

  const { mutate: createCategory, isPending } = useCreateCategory(params)

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

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <PlusIcon />
        Dodaj kategoriju
      </Button>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent className="max-w-sm sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Kreiranje kategorije</DialogTitle>
            <Separator />
          </DialogHeader>
          <FormProvider {...methods}>
            <CategoryForm
              onFormSubmit={onFormSubmit}
              isSubmitting={isPending}
              type="create"
            />
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  )
}
