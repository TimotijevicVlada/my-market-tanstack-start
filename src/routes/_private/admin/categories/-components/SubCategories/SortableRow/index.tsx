import { GripVertical, Star } from 'lucide-react'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { categoriesColumns } from '../../../-data'
import { StatusColumn } from '../../StatusColumn'
import { EditCategory } from '../../EditCategory'
import { DeleteCategory } from '../../DeleteCategory'
import type { Category } from '@/api/categories/types'
import { Badge } from '@/components/ui/badge'
import { TableCell, TableRow } from '@/components/ui/table'
import { formatDate } from '@/utils/format-date'
import { truncateText } from '@/utils/truncate-text'

export const SortableRow = ({
  subcategory,
  index,
  sortMode,
  refetch,
}: {
  subcategory: Category & { parentName?: string | null }
  index: number
  sortMode: boolean
  refetch: () => void
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: subcategory.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? transition : undefined,
  }

  const categoryWithParent = { ...subcategory, parentName: '' as string }

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`bg-muted !border-l-4 !border-l-primary/30 ${isDragging ? 'z-10 shadow-md bg-primary/20' : ''}`}
    >
      {categoriesColumns.map(({ key }) => {
        if (key === 'order') {
          return (
            <TableCell key={key} className="bg-transparent pl-8">
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
                index + 1
              )}
            </TableCell>
          )
        }
        if (key === 'isActive') {
          return (
            <TableCell key={key} className="bg-transparent pl-13">
              <StatusColumn
                category={categoryWithParent}
                refetchCategories={refetch}
              />
            </TableCell>
          )
        }
        if (key === 'name') {
          return (
            <TableCell key={key} className="bg-transparent pl-8">
              <div className="flex items-center gap-1">
                {subcategory[key]}
                {subcategory.featured && (
                  <Star className="h-4 w-4 fill-primary text-primary" />
                )}
              </div>
            </TableCell>
          )
        }
        if (key === 'slug') {
          return (
            <TableCell key={key} className="bg-transparent">
              <Badge variant="secondary" className="rounded-sm">
                {subcategory[key]}
              </Badge>
            </TableCell>
          )
        }
        if (key === 'parentName') {
          return (
            <TableCell key={key} className="bg-transparent">
              /
            </TableCell>
          )
        }
        if (key === 'createdAt' || key === 'updatedAt') {
          return (
            <TableCell key={key} className="bg-transparent">
              {formatDate(subcategory[key])}
            </TableCell>
          )
        }
        if (key === 'description') {
          return (
            <TableCell key={key} className="bg-transparent">
              {truncateText(subcategory[key])}
            </TableCell>
          )
        }
        if (key === 'actions') {
          return (
            <TableCell
              key={key}
              className="bg-transparent sticky right-0 text-right"
            >
              <div className="flex justify-end gap-1">
                <EditCategory
                  category={categoryWithParent}
                  onSuccess={refetch}
                />
                <DeleteCategory
                  category={categoryWithParent}
                  onSuccess={refetch}
                />
              </div>
            </TableCell>
          )
        }
        const value = subcategory[key as keyof typeof subcategory]
        return (
          <TableCell key={key} className="bg-transparent">
            {value != null && typeof value !== 'object' ? String(value) : '/'}
          </TableCell>
        )
      })}
    </TableRow>
  )
}
