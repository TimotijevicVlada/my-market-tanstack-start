import { useState } from 'react'
import { Link, createFileRoute, useSearch } from '@tanstack/react-router'
import { z } from 'zod'
import {
  BrushCleaningIcon,
  Link2Icon,
  MailIcon,
  MessageSquareText,
} from 'lucide-react'
import {
  sellersColumns,
  statusFilterOptions,
  verificationStatusFilterOptions,
} from './-data'
import { StatusColumn } from './-components/StatusColumn'
import { DeleteSeller } from './-components/DeleteSeller'
import { VerifySeller } from './-components/VerifySeller'
import { CreateSeller } from './-components/CreateSeller'
import { UpdateSeller } from './-components/UpdateSeller'
import type {
  GetSellerParams,
  SellerSort,
  SellerStatus,
  SortableSellerColumns,
  VerificationStatus,
} from '@/api/sellers/types'
import { useGetSellers } from '@/api/sellers/queries'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/utils/format-date'
import { Pagination } from '@/components/custom/Pagination'
import { Badge } from '@/components/ui/badge'
import { truncateText } from '@/utils/truncate-text'
import { Tooltip } from '@/components/custom/Tooltip'
import { TableSearch } from '@/components/custom/TableSearch'
import { TableSort } from '@/components/custom/Table/TableSort'
import { TableFilter } from '@/components/custom/Table/TableFilter'
import { TableLoading } from '@/components/custom/Table/TableLoading'
import { TableError } from '@/components/custom/Table/TableError'
import { TableEmptyHolder } from '@/components/custom/Table/TableEmptyHolder'
import { Button } from '@/components/custom/Button'
import { getImageUrl } from '@/utils/get-image-url'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const sellersSearchSchema = z.object({
  page: z.coerce.number().optional(),
})

export const Route = createFileRoute('/_private/sellers/')({
  validateSearch: sellersSearchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const { page = 1 } = useSearch({ from: '/_private/sellers/' })
  const navigate = Route.useNavigate()

  const limit = 10

  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState<SellerStatus | null>(null)
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus | null>(null)
  const [sort, setSort] = useState<SellerSort>({
    key: 'createdAt',
    order: 'desc',
  })

  const hasFilters =
    status !== null ||
    verificationStatus !== null ||
    keyword !== '' ||
    sort.key !== 'createdAt' ||
    sort.order !== 'desc'

  const params: GetSellerParams = {
    page,
    limit,
    keyword,
    status,
    verificationStatus,
    sort,
  }

  const { data, isLoading, error, refetch } = useGetSellers(params)

  const sellers = data?.data ?? []
  const pagination = data?.pagination

  const handleSearch = (searchValue: string) => {
    setKeyword(searchValue)
    navigate({ to: '/sellers', search: (prev) => ({ ...prev, page: 1 }) })
  }

  const handleStatusChange = (newStatus: {
    id: SellerStatus
    label: string
  }) => {
    setStatus(newStatus.id === status ? null : newStatus.id)
    navigate({ to: '/sellers', search: (prev) => ({ ...prev, page: 1 }) })
  }

  const handleVerificationStatusChange = (newStatus: {
    id: VerificationStatus
    label: string
  }) => {
    setVerificationStatus(
      newStatus.id === verificationStatus ? null : newStatus.id,
    )
    navigate({ to: '/sellers', search: (prev) => ({ ...prev, page: 1 }) })
  }

  const handleSort = (key: SortableSellerColumns) => {
    setSort((prev) => ({
      key,
      order: prev.key === key ? (prev.order === 'asc' ? 'desc' : 'asc') : 'asc',
    }))
    navigate({ to: '/sellers', search: (prev) => ({ ...prev, page: 1 }) })
  }

  if (isLoading) {
    return <TableLoading label="Učitavanje prodavaca..." />
  }

  if (error) {
    return <TableError error={error.message} />
  }
  return (
    <div>
      <h1 className="text-xl font-bold">Lista prodavaca</h1>
      <div className="flex justify-between items-center my-4">
        <div className="flex items-center gap-2">
          <TableSearch onSearchClick={handleSearch} />
          {hasFilters && (
            <Button
              variant="secondary"
              onClick={() => {
                setKeyword('')
                setStatus(null)
                setVerificationStatus(null)
                setSort({ key: 'createdAt', order: 'desc' })
              }}
            >
              <BrushCleaningIcon />
              Očisti filtere
            </Button>
          )}
        </div>
        <CreateSeller params={params} />
      </div>
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            {sellersColumns.map(({ key, options, label }) => {
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
              if (key === 'status') {
                return (
                  <TableFilter
                    label={label}
                    dropdownProps={{
                      options: verificationStatusFilterOptions,
                      handleOptionChange: handleVerificationStatusChange,
                      labelKey: 'label',
                      active: { key: 'id', value: verificationStatus },
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
                    {key !== 'actions' &&
                      key !== 'order' &&
                      key !== 'categories' && (
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
          {sellers.length === 0 && (
            <TableEmptyHolder
              colSpan={sellersColumns.length}
              title="Nema prodavaca"
            />
          )}
          {sellers.map((seller, index) => (
            <TableRow key={seller.id} className="group">
              {sellersColumns.map(({ key }) => {
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
                      <StatusColumn seller={seller} refetchSellers={refetch} />
                    </TableCell>
                  )
                }
                if (key === 'displayName') {
                  return (
                    <TableCell key={key}>
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage
                            src={getImageUrl(seller.avatarUrl)}
                            alt={seller.displayName}
                          />
                          <AvatarFallback>
                            {seller.displayName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {seller[key]}
                      </div>
                    </TableCell>
                  )
                }
                if (key === 'email') {
                  return (
                    <TableCell key={key}>
                      {seller[key] ? (
                        <Badge variant="secondary" className="rounded-sm">
                          <MailIcon className="w-3.5! h-3.5!" />
                          {seller[key] ?? '/'}
                        </Badge>
                      ) : (
                        '/'
                      )}
                    </TableCell>
                  )
                }
                if (key === 'website') {
                  return (
                    <TableCell key={key}>
                      <div className="flex items-center gap-2 hover:underline hover:text-primary">
                        {seller[key] && (
                          <Link2Icon className="w-4 h-4 rotate-[-40deg]" />
                        )}
                        <Link
                          to={seller[key] ?? ''}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {seller[key] ?? '/'}
                        </Link>
                      </div>
                    </TableCell>
                  )
                }
                if (key === 'status') {
                  return (
                    <TableCell key={key}>
                      <Tooltip
                        title={seller.verificationNote ?? '/'}
                        disabled={!seller.verificationNote}
                      >
                        <Badge
                          className={`${seller.status === 'approved' ? 'bg-green-500' : seller.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'} text-white`}
                        >
                          {seller.status === 'approved'
                            ? 'Odobreno'
                            : seller.status === 'rejected'
                              ? 'Odbijeno'
                              : 'Na cekanju'}
                          {seller.verificationNote && (
                            <MessageSquareText className="w-4! h-4!" />
                          )}
                        </Badge>
                      </Tooltip>
                    </TableCell>
                  )
                }
                if (key === 'description') {
                  return (
                    <TableCell key={key}>{truncateText(seller[key])}</TableCell>
                  )
                }
                if (key === 'createdAt' || key === 'updatedAt') {
                  return (
                    <TableCell key={key}>{formatDate(seller[key])}</TableCell>
                  )
                }
                if (key === 'categories') {
                  return (
                    <TableCell key={key}>
                      <div className="flex items-center gap-2">
                        {seller[key].slice(0, 2).map((category) => (
                          <Badge
                            key={category.id}
                            variant="secondary"
                            className="rounded-sm"
                          >
                            {category.name}
                          </Badge>
                        ))}
                        {seller[key].length > 2 && (
                          <Tooltip
                            title={seller[key]
                              .slice(2)
                              .map((category) => category.name)
                              .join(', ')}
                          >
                            <Badge variant="secondary" className="rounded-sm">
                              +{seller[key].length - 2}
                            </Badge>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                  )
                }
                if (key === 'actions') {
                  return (
                    <TableCell key={key} className="sticky right-0 text-right">
                      <div className="flex justify-end gap-1">
                        <VerifySeller seller={seller} params={params} />
                        <UpdateSeller seller={seller} params={params} />
                        <DeleteSeller seller={seller} params={params} />
                      </div>
                    </TableCell>
                  )
                }
                return <TableCell key={key}>{seller[key] || '/'}</TableCell>
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
            onPageChange={(newPage) =>
              navigate({
                to: '/sellers',
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
