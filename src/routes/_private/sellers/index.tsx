import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import {
  FilterIcon,
  Link2Icon,
  MailIcon,
  MessageSquareText,
  TriangleAlertIcon,
} from 'lucide-react'
import { sellersColumns, statusFilterOptions } from './-data'
import { StatusColumn } from './-components/StatusColumn'
import { DeleteSeller } from './-components/DeleteSeller'
import { VerifySeller } from './-components/VerifySeller'
import { CreateSeller } from './-components/CreateSeller'
import { UpdateSeller } from './-components/UpdateSeller'
import type { GetSellerParams, SellerStatus } from '@/api/sellers/types'
import { useGetSellers } from '@/api/sellers/queries'
import { Spinner } from '@/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EmptyData } from '@/components/custom/EmptyData'
import { formatDate } from '@/utils/format-date'
import { Pagination } from '@/components/custom/Pagination'
import { Badge } from '@/components/ui/badge'
import { truncateText } from '@/utils/truncate-text'
import { Tooltip } from '@/components/custom/Tooltip'
import { TableSearch } from '@/components/custom/TableSearch'
import { DropdownMenu } from '@/components/custom/DropdownMenu'
import { Button } from '@/components/custom/Button'

export const Route = createFileRoute('/_private/sellers/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [page, setPage] = useState(1)
  const limit = 10

  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState<SellerStatus | null>(null)

  const params: GetSellerParams = { page, limit, keyword, status }

  const { data, isLoading, error, refetch } = useGetSellers(params)

  const sellers = data?.data ?? []
  const pagination = data?.pagination

  const handleSearch = (searchValue: string) => {
    setKeyword(searchValue)
    setPage(1)
  }

  const handleStatusChange = (newStatus: {
    id: SellerStatus
    label: string
  }) => {
    setStatus(newStatus.id === status ? null : newStatus.id)
    setPage(1)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center gap-2 mt-70">
        <Spinner className="w-7 h-7" />
        <span className="text-lg">Ucitavanje prodavaca...</span>
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
      <h1 className="text-xl font-bold">Lista prodavaca</h1>
      <div className="flex justify-between items-center my-4">
        <TableSearch onSearchClick={handleSearch} />
        <CreateSeller params={params} />
      </div>
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            {sellersColumns.map(({ key, options, label }) => {
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
          {sellers.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={sellersColumns.length}
                className="text-center text-muted-foreground"
              >
                <EmptyData title="Nema prodavaca" />
              </TableCell>
            </TableRow>
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
                    <TableCell
                      key={key}
                      className="sticky right-0 z-10 bg-background group-hover:bg-muted-background text-right"
                    >
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
            onPageChange={setPage}
            maxVisiblePages={5}
          />
        </div>
      )}
    </div>
  )
}
