import z from 'zod'
import { BrushCleaningIcon } from 'lucide-react'
import { createFileRoute, useSearch } from '@tanstack/react-router'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
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
import { categoriesColumns, statusFilterOptions } from './-data'
import { CreateCategory } from './-components/CreateCategory'
import { SubCategories } from './-components/SubCategories'
import { MainTableRow } from './-components/MainTableRow'
import { MainSortModeButton } from './-components/MainSortModeButton'
import type { DragEndEvent } from '@dnd-kit/core'
import type {
  Category,
  CategorySort,
  CategoryStatus,
  GetCategoriesParams,
  SortableCategoryColumns,
} from '@/api/categories/types'
import {
  useGetCategories,
  useUpdateSubcategoriesSortOrder,
} from '@/api/categories/queries'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pagination } from '@/components/custom/Pagination'
import { TableSearch } from '@/components/custom/TableSearch'
import { TableLoading } from '@/components/custom/Table/TableLoading'
import { TableError } from '@/components/custom/Table/TableError'
import { TableEmptyHolder } from '@/components/custom/Table/TableEmptyHolder'
import { TableFilter } from '@/components/custom/Table/TableFilter'
import { TableSort } from '@/components/custom/Table/TableSort'
import { Button } from '@/components/custom/Button'

const categoriesSearchSchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
})

export const Route = createFileRoute('/_private/admin/categories/')({
  component: CategoriesPage,
  validateSearch: categoriesSearchSchema,
})

const DEFAULT_LIMIT = 10

function CategoriesPage() {
  const { page = 1, limit: searchLimit } = useSearch({
    from: '/_private/admin/categories/',
  })
  const navigate = Route.useNavigate()
  const limit = searchLimit ?? DEFAULT_LIMIT
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState<CategoryStatus | null>(null)
  const [sort, setSort] = useState<CategorySort>({
    key: 'sortOrder',
    order: 'asc',
  })

  const hasFilters =
    status !== null ||
    keyword !== '' ||
    sort.key !== 'sortOrder' ||
    sort.order !== 'asc'

  const params: GetCategoriesParams = {
    page,
    limit,
    keyword,
    status,
    sort,
  }

  const { data, isLoading, error, refetch, isFetching } =
    useGetCategories(params)

  const [subCategoriesOpenedId, setSubCategoriesOpenedId] = useState<
    string | null
  >(null)
  const [subcategorySortModeCategoryId, setSubcategorySortModeCategoryId] =
    useState<string | null>(null)
  const [saveRequestedCategoryId, setSaveRequestedCategoryId] = useState<
    string | null
  >(null)
  const [mainCategoriesSortMode, setMainCategoriesSortMode] = useState(false)
  const [mainCategoriesSaveRequested, setMainCategoriesSaveRequested] =
    useState(false)
  const [orderedCategories, setOrderedCategories] = useState<Array<Category>>(
    [],
  )

  const mainSortModeEnteredRef = useRef(false)

  const { mutate: updateMainCategoriesSortOrder } =
    useUpdateSubcategoriesSortOrder('main')

  const categories = data?.data ?? []
  const pagination = data?.pagination

  useEffect(() => {
    if (mainCategoriesSortMode && categories.length > 0) {
      if (!mainSortModeEnteredRef.current) {
        setOrderedCategories([...categories])
        mainSortModeEnteredRef.current = true
      } else if (categories.length > orderedCategories.length) {
        setOrderedCategories([...categories])
      }
    } else {
      mainSortModeEnteredRef.current = false
    }
  }, [mainCategoriesSortMode, categories, orderedCategories.length])

  useEffect(() => {
    if (!mainCategoriesSaveRequested || orderedCategories.length === 0) return
    updateMainCategoriesSortOrder(
      orderedCategories.map((c, i) => ({ id: c.id, sortOrder: i })),
      {
        onSuccess: () => {
          setMainCategoriesSaveRequested(false)
          setMainCategoriesSortMode(false)
          refetch()
        },
      },
    )
  }, [mainCategoriesSaveRequested])

  const mainSortSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const mainDisplayList =
    mainCategoriesSortMode && orderedCategories.length > 0
      ? orderedCategories
      : categories

  const handleMainDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id || mainDisplayList.length === 0) return
      const oldIndex = mainDisplayList.findIndex((c) => c.id === active.id)
      const newIndex = mainDisplayList.findIndex((c) => c.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return
      const reordered = arrayMove([...mainDisplayList], oldIndex, newIndex)
      if (mainCategoriesSortMode) {
        setOrderedCategories(reordered)
      }
    },
    [mainDisplayList, mainCategoriesSortMode],
  )

  const handleSearch = (searchValue: string) => {
    setKeyword(searchValue)
    navigate({
      to: '/admin/categories',
      search: (prev) => ({ ...prev, page: 1 }),
    })
  }

  const handleStatusChange = (newStatus: {
    id: CategoryStatus
    label: string
  }) => {
    setStatus(newStatus.id === status ? null : newStatus.id)
    navigate({
      to: '/admin/categories',
      search: (prev) => ({ ...prev, page: 1 }),
    })
  }

  const handleSort = (key: SortableCategoryColumns) => {
    setSort((prev) => ({
      key,
      order: prev.key === key ? (prev.order === 'asc' ? 'desc' : 'asc') : 'asc',
    }))
    navigate({
      to: '/admin/categories',
      search: (prev) => ({ ...prev, page: 1 }),
    })
  }

  if (isLoading) {
    return <TableLoading label="Učitavanje kategorija..." />
  }

  if (error) {
    return <TableError error={error.message} />
  }

  return (
    <div>
      <h1 className="text-xl font-bold">Lista kategorija</h1>
      <div className="flex justify-between items-center my-4">
        <div className="flex items-center gap-2">
          <TableSearch onSearchClick={handleSearch} />
          {hasFilters && (
            <Button
              variant="secondary"
              onClick={() => {
                setKeyword('')
                setStatus(null)
                setSort({ key: 'sortOrder', order: 'asc' })
              }}
            >
              <BrushCleaningIcon />
              Očisti filtere
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <MainSortModeButton
            mainCategoriesSortMode={mainCategoriesSortMode}
            setMainCategoriesSortMode={setMainCategoriesSortMode}
            setMainCategoriesSaveRequested={setMainCategoriesSaveRequested}
            totalRows={pagination?.total ?? 0}
            DEFAULT_LIMIT={DEFAULT_LIMIT}
          />
          <CreateCategory params={params} />
        </div>
      </div>
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            {categoriesColumns.map(({ key, options, label }) => {
              if (key === 'isActive') {
                return (
                  <TableFilter
                    label={label}
                    dropdownProps={{
                      options: statusFilterOptions,
                      handleOptionChange: handleStatusChange,
                      labelKey: 'label',
                      active: { key: 'id', value: status },
                    }}
                  />
                )
              }
              return (
                <TableHead key={key} {...options}>
                  <div
                    className={`flex items-center gap-2 ${key === 'actions' ? 'justify-end' : ''}`}
                  >
                    {label}
                    {key !== 'actions' && key !== 'order' && (
                      <TableSort
                        sort={sort}
                        columnKey={key}
                        handleSort={handleSort}
                      />
                    )}
                  </div>
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 &&
            !(mainCategoriesSortMode && isFetching) && (
              <TableEmptyHolder
                colSpan={categoriesColumns.length}
                title="Nema kategorija"
              />
            )}
          {mainCategoriesSortMode &&
            isFetching &&
            categories.length < limit && (
              <TableRow>
                <TableCell
                  colSpan={categoriesColumns.length}
                  className="text-center py-8"
                >
                  <TableLoading label="Učitavanje kategorija za sortiranje..." />
                </TableCell>
              </TableRow>
            )}

          <DndContext
            sensors={mainSortSensors}
            collisionDetection={closestCenter}
            onDragEnd={handleMainDragEnd}
          >
            <SortableContext
              items={mainDisplayList.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {mainDisplayList.map((category, index) => (
                <Fragment key={category.id}>
                  <MainTableRow
                    category={category}
                    index={index}
                    page={page}
                    limit={limit}
                    sortMode={mainCategoriesSortMode}
                    subCategoriesOpenedId={subCategoriesOpenedId}
                    setSubCategoriesOpenedId={setSubCategoriesOpenedId}
                    subcategorySortModeCategoryId={
                      subcategorySortModeCategoryId
                    }
                    setSubcategorySortModeCategoryId={
                      setSubcategorySortModeCategoryId
                    }
                    refetch={refetch}
                    setSaveRequestedCategoryId={setSaveRequestedCategoryId}
                    params={params}
                  />
                  {subCategoriesOpenedId === category.id && (
                    <SubCategories
                      categoryId={subCategoriesOpenedId}
                      sortMode={subcategorySortModeCategoryId === category.id}
                      saveRequested={saveRequestedCategoryId === category.id}
                      onSaveDone={() => {
                        setSaveRequestedCategoryId(null)
                        setSubcategorySortModeCategoryId(null)
                      }}
                    />
                  )}
                </Fragment>
              ))}
            </SortableContext>
          </DndContext>
        </TableBody>
      </Table>
      {pagination && (
        <div className="mt-4">
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            onPageChange={(newPage) =>
              navigate({
                to: '/admin/categories',
                search: (prev) => ({ ...prev, page: newPage }),
              })
            }
            maxVisiblePages={5}
          />
        </div>
      )}
    </div>
  )
}
