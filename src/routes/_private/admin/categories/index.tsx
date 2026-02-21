import z from 'zod'
import { BrushCleaningIcon, ChevronDownIcon, Star } from 'lucide-react'
import { createFileRoute, useSearch } from '@tanstack/react-router'
import { Fragment, useState } from 'react'
import { StatusColumn } from './-components/StatusColumn'
import { categoriesColumns, statusFilterOptions } from './-data'
import { CreateCategory } from './-components/CreateCategory'
import { SubCategories } from './-components/SubCategories'
import { EditCategory } from './-components/EditCategory'
import { DeleteCategory } from './-components/DeleteCategory'
import type {
  CategorySort,
  CategoryStatus,
  GetCategoriesParams,
  SortableCategoryColumns,
} from '@/api/categories/types'
import { useGetCategories } from '@/api/categories/queries'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Pagination } from '@/components/custom/Pagination'
import { formatDate } from '@/utils/format-date'
import { truncateText } from '@/utils/truncate-text'
import { TableSearch } from '@/components/custom/TableSearch'
import { TableLoading } from '@/components/custom/Table/TableLoading'
import { TableError } from '@/components/custom/Table/TableError'
import { TableEmptyHolder } from '@/components/custom/Table/TableEmptyHolder'
import { TableFilter } from '@/components/custom/Table/TableFilter'
import { TableSort } from '@/components/custom/Table/TableSort'
import { Button } from '@/components/custom/Button'
import { cn } from '@/lib/utils'

const categoriesSearchSchema = z.object({
  page: z.coerce.number().optional(),
})

export const Route = createFileRoute('/_private/admin/categories/')({
  component: CategoriesPage,
  validateSearch: categoriesSearchSchema,
})

function CategoriesPage() {
  const { page = 1 } = useSearch({ from: '/_private/admin/categories/' })
  const navigate = Route.useNavigate()

  const limit = 10

  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState<CategoryStatus | null>(null)
  const [sort, setSort] = useState<CategorySort>({
    key: 'createdAt',
    order: 'desc',
  })

  const hasFilters =
    status !== null ||
    keyword !== '' ||
    sort.key !== 'createdAt' ||
    sort.order !== 'desc'

  const params: GetCategoriesParams = {
    page,
    limit,
    keyword,
    status,
    sort,
  }

  const { data, isLoading, error, refetch } = useGetCategories(params)
  const [subCategoriesOpenedId, setSubCategoriesOpenedId] = useState<
    string | null
  >(null)

  const categories = data?.data ?? []
  const pagination = data?.pagination

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
                setSort({ key: 'createdAt', order: 'desc' })
              }}
            >
              <BrushCleaningIcon />
              Očisti filtere
            </Button>
          )}
        </div>
        <CreateCategory params={params} />
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
          {categories.length === 0 && (
            <TableEmptyHolder
              colSpan={categoriesColumns.length}
              title="Nema kategorija"
            />
          )}
          {categories.map((category, index) => (
            <Fragment key={category.id}>
              <TableRow className="group">
                {categoriesColumns.map(({ key }) => {
                  if (key === 'order') {
                    return (
                      <TableCell key={key}>
                        {(page - 1) * limit + index + 1}
                      </TableCell>
                    )
                  }
                  if (key === 'isActive') {
                    return (
                      <TableCell key={key}>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="secondary"
                            size="icon-sm"
                            onClick={() =>
                              setSubCategoriesOpenedId(
                                subCategoriesOpenedId === category.id
                                  ? null
                                  : category.id,
                              )
                            }
                          >
                            <ChevronDownIcon
                              className={cn(
                                subCategoriesOpenedId === category.id
                                  ? 'rotate-180'
                                  : '',
                              )}
                            />
                          </Button>
                          <StatusColumn
                            category={category}
                            refetchCategories={refetch}
                          />
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
                  if (key === 'parentName') {
                    return (
                      <TableCell key={key}>{category[key] ?? '/'}</TableCell>
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
                    return (
                      <TableCell key={key}>
                        {formatDate(category[key])}
                      </TableCell>
                    )
                  }
                  if (key === 'description') {
                    return (
                      <TableCell key={key}>
                        {truncateText(category[key])}
                      </TableCell>
                    )
                  }
                  if (key === 'actions') {
                    return (
                      <TableCell
                        key={key}
                        className="sticky right-0 text-right"
                      >
                        <div className="flex justify-end gap-1">
                          <EditCategory category={category} params={params} />
                          <DeleteCategory category={category} params={params} />
                        </div>
                      </TableCell>
                    )
                  }
                  return <TableCell key={key}>{category[key] || '/'}</TableCell>
                })}
              </TableRow>
              {subCategoriesOpenedId === category.id && (
                <SubCategories categoryId={subCategoriesOpenedId} />
              )}
            </Fragment>
          ))}
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
