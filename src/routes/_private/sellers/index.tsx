import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowRightIcon,
  Link2Icon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  ShieldCheck,
  Trash2Icon,
  TriangleAlertIcon,
} from 'lucide-react'
import { sellersColumns } from './-data'
import type { GetSellerParams } from '@/api/sellers/types'
import { useGetSellers } from '@/api/sellers/queries'
import { Spinner } from '@/components/ui/spinner'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
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
import { formatDate } from '@/utils/format-date'
import { Pagination } from '@/components/custom/Pagination'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { truncateText } from '@/utils/truncate-text'

export const Route = createFileRoute('/_private/sellers/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [page, setPage] = useState(1)
  const limit = 10

  const params: GetSellerParams = { page, limit }

  const { data, isLoading, error } = useGetSellers(params)

  const sellers = data?.data ?? []
  const pagination = data?.pagination

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
        <ButtonGroup className="w-[15rem]">
          <InputGroup>
            <InputGroupInput
              type="text"
              placeholder="Pretraga..."
              // value={searchInputValue}
              // onChange={(e) => setSearchInputValue(e.target.value)}
              // onKeyDown={(e) => {
              //   if (e.key === 'Enter') {
              //     handleSearch()
              //   }
              // }}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
          <Button
            variant="outline"
            aria-label="Search"
            // onClick={() => handleSearch()}
          >
            <ArrowRightIcon />
          </Button>
        </ButtonGroup>
        <Button>
          <PlusIcon />
          Dodaj prodavca
        </Button>
      </div>
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            {sellersColumns.map(({ key, options, label }) => {
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
                colSpan={9}
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
                      <Switch
                        checked={seller.isActive}
                        onCheckedChange={() => {}}
                      />
                    </TableCell>
                  )
                }
                if (key === 'email') {
                  return (
                    <TableCell key={key}>
                      <Badge variant="secondary" className="rounded-sm">
                        {seller[key]}
                      </Badge>
                    </TableCell>
                  )
                }
                if (key === 'website') {
                  return (
                    <TableCell key={key}>
                      <div className="flex items-center gap-2 hover:underline hover:text-primary">
                        <Link2Icon className="w-4 h-4" />
                        <Link
                          to={seller[key] ?? ''}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {seller[key]}
                        </Link>
                      </div>
                    </TableCell>
                  )
                }
                if (key === 'status') {
                  return (
                    <TableCell key={key}>
                      <Badge
                        className={`${seller.status === 'approved' ? 'bg-green-500' : seller.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'} text-white`}
                      >
                        {seller.status === 'approved'
                          ? 'Odobreno'
                          : seller.status === 'rejected'
                            ? 'Odbijeno'
                            : 'Na cekanju'}
                      </Badge>
                    </TableCell>
                  )
                }
                if (key === 'description') {
                  return (
                    <TableCell key={key}>
                      {truncateText(seller[key] ?? '')}
                    </TableCell>
                  )
                }
                if (key === 'createdAt' || key === 'updatedAt') {
                  return (
                    <TableCell key={key}>{formatDate(seller[key])}</TableCell>
                  )
                }
                if (key === 'actions') {
                  return (
                    <TableCell
                      key={key}
                      className="sticky right-0 z-10 bg-background group-hover:bg-muted-background text-right"
                    >
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          disabled={seller.status !== 'pending'}
                        >
                          <ShieldCheck
                            className={`${seller.status === 'pending' ? 'text-blue-500' : 'text-muted-foreground'}`}
                          />
                        </Button>
                        <Button variant="ghost" size="icon-sm">
                          <PencilIcon className="text-orange-500" />
                        </Button>
                        <Button variant="ghost" size="icon-sm">
                          <Trash2Icon className="text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  )
                }
                return <TableCell key={key}>{seller[key] ?? '/'}</TableCell>
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
