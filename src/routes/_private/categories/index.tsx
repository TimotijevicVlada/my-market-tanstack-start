import { BrushCleaningIcon } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { StatusColumn } from './-components/StatusColumn'
import { categoriesColumns, statusFilterOptions } from './-data'
import { CreateCategory } from './-components/CreateCategory'
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

export const Route = createFileRoute('/_private/categories/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [page, setPage] = useState(1)
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

  const categories = data?.data ?? []
  const pagination = data?.pagination

  const handleSearch = (searchValue: string) => {
    setKeyword(searchValue)
    setPage(1)
  }

  const handleStatusChange = (newStatus: {
    id: CategoryStatus
    label: string
  }) => {
    setStatus(newStatus.id === status ? null : newStatus.id)
    setPage(1)
  }

  const handleSort = (key: SortableCategoryColumns) => {
    setSort((prev) => ({
      key,
      order: prev.key === key ? (prev.order === 'asc' ? 'desc' : 'asc') : 'asc',
    }))
    setPage(1)
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
            <TableRow key={category.id} className="group">
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
                      <StatusColumn
                        category={category}
                        refetchCategories={refetch}
                      />
                    </TableCell>
                  )
                }
                if (key === 'parentName') {
                  return <TableCell key={key}>{category[key] ?? '/'}</TableCell>
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
                    <TableCell key={key}>{formatDate(category[key])}</TableCell>
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
                      className="sticky right-0 z-10 bg-background group-hover:bg-muted-background text-right"
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
          ))}
        </TableBody>
      </Table>
      {pagination && (
        <div className="mt-4">
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
            maxVisiblePages={5}
          />
        </div>
      )}
    </div>
  )
}
