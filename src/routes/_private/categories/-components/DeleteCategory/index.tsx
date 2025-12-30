import { Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import type { Category, GetCategoriesParams } from '@/api/categories/types'
import { Button } from '@/components/custom/Button'
import { AlertDialog } from '@/components/custom/AlertDialog'
import { Tooltip } from '@/components/custom/Tooltip'
import { useDeleteCategory } from '@/api/categories/queries'

interface DeleteCategoryProps {
  category: Category
  params: GetCategoriesParams
}

export const DeleteCategory = ({ category, params }: DeleteCategoryProps) => {
  const { mutate: deleteCategory, isPending } = useDeleteCategory(params)

  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Tooltip title="Brisanje kategorije">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
          loading={{ state: isPending, text: 'Brisanje...' }}
        >
          <Trash2Icon className="text-red-500" />
        </Button>
      </Tooltip>
      <AlertDialog
        open={isOpen}
        onOpenChange={() => setIsOpen(false)}
        title="Potvrdite brisanje kategorije"
        description={`Da li ste sigurni da želite da obrišete kategoriju ${category.name.toUpperCase()}?`}
        onConfirm={() => deleteCategory({ data: { categoryId: category.id } })}
        onCancel={() => setIsOpen(false)}
        confirmText="Obrisi"
        loading={{
          state: isPending,
          text: 'Brisanje...',
        }}
      />
    </>
  )
}
