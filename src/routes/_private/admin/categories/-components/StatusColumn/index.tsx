import { useState } from 'react'
import type { Category } from '@/api/categories/types'
import { useToggleCategoryActiveStatus } from '@/api/categories/queries'
import { Switch } from '@/components/ui/switch'
import { AlertDialog } from '@/components/custom/AlertDialog'

interface StatusColumnProps {
  category: Category
  refetchCategories: () => void
}

export const StatusColumn = ({
  category,
  refetchCategories,
}: StatusColumnProps) => {
  const [categoryIdForDeactivation, setCategoryIdForDeactivation] = useState<
    string | null
  >(null)

  const {
    mutate: toggleCategoryActiveStatus,
    isPending: isTogglingCategoryActiveStatus,
  } = useToggleCategoryActiveStatus()

  const handleToggleCategoryActiveStatus = () => {
    if (!categoryIdForDeactivation) return
    toggleCategoryActiveStatus(
      { data: { categoryId: categoryIdForDeactivation } },
      {
        onSuccess: () => {
          refetchCategories()
          setCategoryIdForDeactivation(null)
        },
      },
    )
  }

  const handleActivateCategory = (categoryId: string) => {
    toggleCategoryActiveStatus(
      { data: { categoryId } },
      {
        onSuccess: () => {
          refetchCategories()
        },
      },
    )
  }

  return (
    <>
      <Switch
        size="sm"
        checked={category.isActive}
        onCheckedChange={() => {
          if (category.isActive) {
            setCategoryIdForDeactivation(category.id)
          } else {
            handleActivateCategory(category.id)
          }
        }}
      />
      <AlertDialog
        open={!!categoryIdForDeactivation}
        onOpenChange={() => setCategoryIdForDeactivation(null)}
        title="Potvrdite deaktivaciju kategorije"
        description={`Da li ste sigurni da želite da deaktivujete kategoriju ${category.name.toUpperCase()}?`}
        onConfirm={() => handleToggleCategoryActiveStatus()}
        onCancel={() => setCategoryIdForDeactivation(null)}
        confirmText="Deaktiviraj"
        loading={{
          state: isTogglingCategoryActiveStatus,
          text: 'Deaktiviranje...',
        }}
      />
    </>
  )
}
