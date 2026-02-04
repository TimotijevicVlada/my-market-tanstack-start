import z from 'zod'
import { useState } from 'react'
import { Link, createFileRoute, useSearch } from '@tanstack/react-router'
import { BrushCleaningIcon, PencilIcon, PlusIcon } from 'lucide-react'
import {
  productsColumns,
  statusBadgeConfig,
  statusFilterOptions,
} from './-data'
import type {
  GetProductsParams,
  Product,
  ProductSort,
  ProductStatusFilter,
} from '@/api/products/types'
import { SORTABLE_PRODUCT_COLUMNS } from '@/api/products/types'
import { Button } from '@/components/ui/button'
import { TableSearch } from '@/components/custom/TableSearch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pagination } from '@/components/custom/Pagination'
import { TableEmptyHolder } from '@/components/custom/Table/TableEmptyHolder'
import { TableLoading } from '@/components/custom/Table/TableLoading'
import { TableError } from '@/components/custom/Table/TableError'
import { useGetProducts } from '@/api/products/queries'
import { formatDate } from '@/utils/format-date'
import { Badge } from '@/components/ui/badge'
import { TableSort } from '@/components/custom/Table/TableSort'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TableFilter } from '@/components/custom/Table/TableFilter'

const productsSearchSchema = z.object({
  page: z.coerce.number().optional(),
})

export const Route = createFileRoute('/_private/seller/products/')({
  validateSearch: productsSearchSchema,
  component: () => {
    const { page = 1 } = useSearch({ from: '/_private/seller/products/' })
    const navigate = Route.useNavigate()

    const limit = 10

    const [keyword, setKeyword] = useState('')
    const [status, setStatus] = useState<ProductStatusFilter | null>(null)
    const [sort, setSort] = useState<ProductSort>({
      key: 'createdAt',
      order: 'desc',
    })

    const handleStatusChange = (newStatus: {
      id: ProductStatusFilter
      label: string
    }) => {
      setStatus(newStatus.id === status ? null : newStatus.id)
      navigate({
        to: '/seller/products',
        search: (prev) => ({ ...prev, page: 1 }),
      })
    }

    const handleSearch = (searchValue: string) => {
      setKeyword(searchValue)
      navigate({
        to: '/seller/products',
        search: (prev) => ({ ...prev, page: 1 }),
      })
    }

    const handleSort = (key: keyof Product) => {
      if (
        !SORTABLE_PRODUCT_COLUMNS.includes(
          key as (typeof SORTABLE_PRODUCT_COLUMNS)[number],
        )
      )
        return
      setSort((prev) => ({
        key,
        order:
          prev.key === key ? (prev.order === 'asc' ? 'desc' : 'asc') : 'asc',
      }))
      navigate({
        to: '/seller/products',
        search: (prev) => ({ ...prev, page: 1 }),
      })
    }

    const hasFilters =
      status !== null ||
      keyword !== '' ||
      sort.key !== 'createdAt' ||
      sort.order !== 'desc'

    const params: GetProductsParams = { page, limit, keyword, status, sort }

    const { data, isLoading, error } = useGetProducts(params)

    if (isLoading) {
      return <TableLoading label="Učitavanje proizvoda..." />
    }

    if (error) {
      return <TableError error={error.message} />
    }

    return (
      <div>
        <h1 className="text-xl font-bold">Moji proizvodi</h1>
        <div className="flex justify-between items-center my-4">
          <div className="flex items-center gap-2">
            <TableSearch onSearchClick={handleSearch} />
            {hasFilters && (
              <Button
                variant="secondary"
                onClick={() => {
                  setKeyword('')
                  setStatus(null)
                  setKeyword('')
                  setSort({ key: 'createdAt', order: 'desc' })
                }}
              >
                <BrushCleaningIcon />
                Očisti filtere
              </Button>
            )}
          </div>
          <Button onClick={() => navigate({ to: '/seller/products/create' })}>
            <PlusIcon />
            Kreiraj proizvod
          </Button>
        </div>
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              {productsColumns.map(({ key, options, label, hasSort }) => {
                if (key === 'status') {
                  return (
                    <div className="flex items-center">
                      <TableFilter
                        label={label}
                        dropdownProps={{
                          options: statusFilterOptions,
                          handleOptionChange: handleStatusChange,
                          labelKey: 'label',
                          active: { key: 'id', value: status },
                        }}
                      />
                      <TableSort
                        sort={sort}
                        columnKey={key as keyof Product}
                        handleSort={handleSort}
                      />
                    </div>
                  )
                }
                return (
                  <TableHead key={key} {...options}>
                    <div
                      className={`flex items-center gap-2 ${key === 'actions' ? 'justify-end' : ''}`}
                    >
                      {label}
                      {hasSort && (
                        <TableSort
                          sort={sort}
                          columnKey={key as keyof Product}
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
            {data?.data.length === 0 && (
              <TableEmptyHolder
                colSpan={productsColumns.length}
                title="Nema proizvoda"
              />
            )}
            {data?.data.map((product, index) => (
              <TableRow key={product.id} className="group">
                {productsColumns.map(({ key }) => {
                  if (key === 'order') {
                    return (
                      <TableCell key={key}>
                        {(page - 1) * limit + index + 1}
                      </TableCell>
                    )
                  }
                  if (key === 'status') {
                    const statusConfig = statusBadgeConfig[product.status]
                    return (
                      <TableCell key={key}>
                        <Badge
                          variant="secondary"
                          className={`${statusConfig.className} text-white border-0`}
                        >
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                    )
                  }
                  if (key === 'name') {
                    return (
                      <TableCell key={key}>
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage
                              src={product.primaryImageUrl ?? undefined}
                              alt={product.name}
                              className="rounded-sm"
                            />
                            <AvatarFallback className="rounded-sm">
                              {product.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {product[key]}
                        </div>
                      </TableCell>
                    )
                  }
                  if (key === 'slug') {
                    return (
                      <TableCell key={key}>
                        <Badge variant="secondary" className="rounded-sm">
                          {product[key]}
                        </Badge>
                      </TableCell>
                    )
                  }
                  if (key === 'price') {
                    return (
                      <TableCell key={key}>
                        {`${product[key]} ${product.currency}`}
                      </TableCell>
                    )
                  }
                  if (key === 'categoryId') {
                    return (
                      <TableCell key={key}>
                        {product.categoryName || '/'}
                      </TableCell>
                    )
                  }
                  if (key === 'createdAt' || key === 'updatedAt') {
                    return (
                      <TableCell key={key}>
                        {formatDate(product[key])}
                      </TableCell>
                    )
                  }
                  if (key === 'actions') {
                    return (
                      <TableCell
                        key={key}
                        className="sticky right-0 text-right"
                      >
                        <Button variant="ghost" size="icon-sm" asChild>
                          <Link
                            to="/seller/products/edit/$productId"
                            params={{ productId: product.id }}
                          >
                            <PencilIcon className="text-orange-500" />
                          </Link>
                        </Button>
                      </TableCell>
                    )
                  }
                  const value = product[key]
                  return <TableCell key={key}>{String(value) || '/'}</TableCell>
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {data?.pagination && (
          <div className="mt-4">
            <Pagination
              currentPage={page}
              totalPages={data.pagination.totalPages}
              onPageChange={(newPage) =>
                navigate({
                  to: '/seller/products',
                  search: (prev) => ({ ...prev, page: newPage }),
                })
              }
              maxVisiblePages={5}
            />
          </div>
        )}
      </div>
    )
  },
})
