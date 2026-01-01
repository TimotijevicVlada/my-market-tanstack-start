import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { FilterIcon, TriangleAlertIcon } from 'lucide-react'
import { StatusColumn } from './-components/StatusColumn'
import { categoriesColumns, statusFilterOptions } from './-data'
import { CreateCategory } from './-components/CreateCategory'
import { EditCategory } from './-components/EditCategory'
import { DeleteCategory } from './-components/DeleteCategory'
import type {
  CategoryStatus,
  GetCategoriesParams,
} from '@/api/categories/types'
import { useGetCategories } from '@/api/categories/queries'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/custom/Button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EmptyData } from '@/components/custom/EmptyData'
import { Badge } from '@/components/ui/badge'
import { Pagination } from '@/components/custom/Pagination'
import { formatDate } from '@/utils/format-date'
import { DropdownMenu } from '@/components/custom/DropdownMenu'
import { truncateText } from '@/utils/truncate-text'
import { TableSearch } from '@/components/custom/TableSearch'

export const Route = createFileRoute('/_private/categories/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [page, setPage] = useState(1)
  const limit = 10

  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState<CategoryStatus | null>(null)

  const params: GetCategoriesParams = {
    page,
    limit,
    keyword,
  }

  if (status) {
    params.status = status
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center gap-2 mt-70">
        <Spinner className="w-7 h-7" />
        <span className="text-lg">Ucitavanje kategorija...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center gap-2 mt-70">
        <TriangleAlertIcon className="w-7 h-7 text-destructive" />
        <span className="text-lg text-destructive">{error.message}</span>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-xl font-bold">Lista kategorija</h1>
      <div className="flex justify-between items-center my-4">
        <TableSearch onSearchClick={handleSearch} />
        <CreateCategory params={params} />
      </div>
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            {categoriesColumns.map(({ key, options, label }) => {
              if (key === 'isActive') {
                return (
                  <TableHead
                    key={key}
                    {...options}
                    className="flex items-center gap-3"
                  >
                    {label}
                    <DropdownMenu
                      options={statusFilterOptions}
                      handleOptionChange={handleStatusChange}
                      labelKey="label"
                      active={{ key: 'id', value: status }}
                      triggerButton={
                        <Button
                          variant="ghost"
                          aria-label="Open menu"
                          size="icon-sm"
                        >
                          <FilterIcon
                            className={`w-3.5 h-3.5 text-${status ? 'primary' : 'muted-foreground'}`}
                          />
                        </Button>
                      }
                    />
                  </TableHead>
                )
              }
              return (
                <TableHead key={key} {...options}>
                  {label}
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center text-muted-foreground"
              >
                <EmptyData title="Nema kategorija" />
              </TableCell>
            </TableRow>
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
