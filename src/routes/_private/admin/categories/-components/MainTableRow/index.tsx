import { ChevronDownIcon, GripVertical, Star } from 'lucide-react'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { StatusColumn } from '../StatusColumn'
import { categoriesColumns } from '../../-data'
import { SortModeButton } from '../SortModeButton'
import { CreateSubcategory } from '../CreateSubcategory'
import { DeleteCategory } from '../DeleteCategory'
import { EditCategory } from '../EditCategory'
import type { Dispatch, SetStateAction } from 'react'
import type { Category, GetCategoriesParams } from '@/api/categories/types'
import { TableCell, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/utils/format-date'
import { truncateText } from '@/utils/truncate-text'
import { Button } from '@/components/custom/Button'
import { cn } from '@/lib/utils'

interface MainTableRowProps {
  category: Category
  index: number
  page: number
  limit: number
  sortMode?: boolean
  subCategoriesOpenedId: string | null
  setSubCategoriesOpenedId: Dispatch<SetStateAction<string | null>>
  subcategorySortModeCategoryId: string | null
  setSubcategorySortModeCategoryId: Dispatch<SetStateAction<string | null>>
  refetch: () => void
  setSaveRequestedCategoryId: Dispatch<SetStateAction<string | null>>
  params: GetCategoriesParams
}

export const MainTableRow = ({
  category,
  index,
  page,
  limit,
  sortMode = false,
  subCategoriesOpenedId,
  setSubCategoriesOpenedId,
  subcategorySortModeCategoryId,
  setSubcategorySortModeCategoryId,
  refetch,
  setSaveRequestedCategoryId,
  params,
}: MainTableRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? transition : undefined,
  }

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={cn(
        'group',
        isDragging && 'z-10 shadow-md bg-primary/20 [&_td]:bg-transparent',
      )}
    >
      {categoriesColumns.map(({ key }) => {
        if (key === 'order') {
          return (
            <TableCell key={key}>
              {sortMode ? (
                <button
                  type="button"
                  className="flex cursor-grab touch-none items-center justify-center rounded p-1 text-muted-foreground transition-colors hover:bg-muted-foreground/20 hover:text-foreground active:cursor-grabbing"
                  {...attributes}
                  {...listeners}
                  aria-label="Prevuci za promenu redosleda"
                >
                  <GripVertical className="h-4 w-4" />
                </button>
              ) : (
                (page - 1) * limit + index + 1
              )}
            </TableCell>
          )
        }
        if (key === 'isActive') {
          return (
            <TableCell key={key}>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    const nextOpened =
                      subCategoriesOpenedId === category.id ? null : category.id
                    setSubCategoriesOpenedId(nextOpened)
                    if (
                      nextOpened === null &&
                      subcategorySortModeCategoryId === category.id
                    ) {
                      setSubcategorySortModeCategoryId(null)
                    }
                  }}
                >
                  <ChevronDownIcon
                    className={cn(
                      subCategoriesOpenedId === category.id ? 'rotate-180' : '',
                    )}
                  />
                </Button>
                <StatusColumn category={category} refetchCategories={refetch} />
              </div>
            </TableCell>
          )
        }
        if (key === 'name') {
          return (
            <TableCell key={key}>
              <div className="flex items-center gap-1">
                {category[key]}
                {category.featured && (
                  <Star className="h-4 w-4 fill-primary text-primary" />
                )}
              </div>
            </TableCell>
          )
        }
        if (key === 'slug') {
          return (
            <TableCell key={key}>
              <Badge variant="secondary" className="rounded-sm">
                {category[key]}
              </Badge>
            </TableCell>
          )
        }
        if (key === 'createdAt' || key === 'updatedAt') {
          return <TableCell key={key}>{formatDate(category[key])}</TableCell>
        }
        if (key === 'description') {
          return <TableCell key={key}>{truncateText(category[key])}</TableCell>
        }
        if (key === 'actions') {
          return (
            <TableCell key={key} className="sticky right-0 text-right">
              <div className="flex justify-end gap-1">
                <SortModeButton
                  categoryId={category.id}
                  subcategorySortModeCategoryId={subcategorySortModeCategoryId}
                  setSubcategorySortModeCategoryId={
                    setSubcategorySortModeCategoryId
                  }
                  setSubCategoriesOpenedId={setSubCategoriesOpenedId}
                  setSaveRequestedCategoryId={setSaveRequestedCategoryId}
                />
                <CreateSubcategory parentCategoryId={category.id} />
                <EditCategory category={category} params={params} />
                <DeleteCategory category={category} params={params} />
              </div>
            </TableCell>
          )
        }
        return <TableCell key={key}>{category[key] || '/'}</TableCell>
      })}
    </TableRow>
  )
}
