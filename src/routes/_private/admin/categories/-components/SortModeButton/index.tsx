import { ArrowUpDownIcon, CheckCheck, XIcon } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import { Tooltip } from '@/components/custom/Tooltip'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'

interface SortModeButtonProps {
  categoryId: string
  subcategorySortModeCategoryId: string | null
  setSubcategorySortModeCategoryId: Dispatch<SetStateAction<string | null>>
  setSubCategoriesOpenedId: Dispatch<SetStateAction<string | null>>
  setSaveRequestedCategoryId: Dispatch<SetStateAction<string | null>>
}

export const SortModeButton = ({
  categoryId,
  subcategorySortModeCategoryId,
  setSubcategorySortModeCategoryId,
  setSubCategoriesOpenedId,
  setSaveRequestedCategoryId,
}: SortModeButtonProps) => {
  const isSortMode = subcategorySortModeCategoryId === categoryId

  if (isSortMode) {
    return (
      <ButtonGroup>
        <Tooltip title="Sačuvaj redosled podkategorija">
          <Button
            variant="default"
            size="icon-sm"
            onClick={() => setSaveRequestedCategoryId(categoryId)}
          >
            <CheckCheck />
          </Button>
        </Tooltip>
        <Tooltip title="Poništi redosled podkategorija">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setSubcategorySortModeCategoryId(null)}
          >
            <XIcon />
          </Button>
        </Tooltip>
      </ButtonGroup>
    )
  }

  return (
    <Tooltip title="Sortiraj podkategorije">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => {
          setSubcategorySortModeCategoryId((prev) =>
            prev === categoryId ? null : categoryId,
          )
          setSubCategoriesOpenedId(categoryId)
        }}
      >
        <ArrowUpDownIcon />
      </Button>
    </Tooltip>
  )
}
