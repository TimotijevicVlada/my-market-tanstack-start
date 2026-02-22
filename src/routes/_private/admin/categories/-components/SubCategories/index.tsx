import { useCallback, useEffect, useRef, useState } from 'react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { categoriesColumns } from '../../-data'
import { SortableRow } from './SortableRow'
import type { DragEndEvent } from '@dnd-kit/core'
import type { Category } from '@/api/categories/types'
import {
  useGetSubCategories,
  useUpdateSubcategoriesSortOrder,
} from '@/api/categories/queries'
import { TableCell, TableRow } from '@/components/ui/table'

interface SubCategoriesProps {
  categoryId: string
  sortMode?: boolean
  saveRequested?: boolean
  onSaveDone?: () => void
}

export const SubCategories = ({
  categoryId,
  sortMode = false,
  saveRequested = false,
  onSaveDone,
}: SubCategoriesProps) => {
  const {
    data: subcategories,
    refetch,
    isLoading,
  } = useGetSubCategories(categoryId)

  const { mutate: updateSortOrder } =
    useUpdateSubcategoriesSortOrder(categoryId)

  const [orderedSubcategories, setOrderedSubcategories] = useState<
    Array<Category & { parentName?: string | null }>
  >([])
  const sortModeEnteredRef = useRef(false)

  useEffect(() => {
    if (sortMode && subcategories?.length) {
      if (!sortModeEnteredRef.current) {
        setOrderedSubcategories(
          subcategories.map((s) => ({ ...s, parentName: null })),
        )
        sortModeEnteredRef.current = true
      }
    } else {
      sortModeEnteredRef.current = false
    }
  }, [sortMode, subcategories])

  useEffect(() => {
    if (!saveRequested || orderedSubcategories.length === 0) return
    updateSortOrder(
      orderedSubcategories.map((s, i) => ({ id: s.id, sortOrder: i })),
      { onSuccess: () => onSaveDone?.() },
    )
  }, [saveRequested])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const displayList =
    sortMode && orderedSubcategories.length > 0
      ? orderedSubcategories
      : (subcategories ?? [])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id || displayList.length === 0) return
      const oldIndex = displayList.findIndex((s) => s.id === active.id)
      const newIndex = displayList.findIndex((s) => s.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return
      const reordered = arrayMove(
        [...displayList],
        oldIndex,
        newIndex,
      ) as Array<Category & { parentName?: string | null }>
      if (sortMode) {
        setOrderedSubcategories(reordered)
      }
    },
    [displayList, sortMode],
  )

  if (isLoading) {
    return (
      <TableRow className="bg-muted border-l-4 border-l-primary/30">
        <TableCell
          colSpan={categoriesColumns.length}
          className="font-medium text-md bg-transparent"
        >
          Učitavanje podkategorija...
        </TableCell>
      </TableRow>
    )
  }

  if (!subcategories || subcategories.length === 0) {
    return (
      <TableRow className="bg-muted border-l-4 border-l-primary/30">
        <TableCell
          colSpan={categoriesColumns.length}
          className="font-medium text-md bg-transparent"
        >
          Nema podkategorija
        </TableCell>
      </TableRow>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={displayList.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        {displayList.map((subcategory, index) => (
          <SortableRow
            key={subcategory.id}
            subcategory={{ ...subcategory, parentName: null }}
            index={index}
            sortMode={sortMode}
            refetch={refetch}
          />
        ))}
      </SortableContext>
    </DndContext>
  )
}
