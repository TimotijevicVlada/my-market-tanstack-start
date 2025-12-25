import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowRightIcon,
  PencilIcon,
  SearchIcon,
  Trash2Icon,
  TriangleAlertIcon,
} from 'lucide-react'
import { getRole } from './-data'
import { StatusColumn } from './-components/StatusColumn'
import { CreateUser } from './-components/CreateUser'
import { useGetUsers } from '@/api/users/queries'
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
import { Button } from '@/components/custom/Button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import { ButtonGroup } from '@/components/ui/button-group'

export const Route = createFileRoute('/_private/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [page, setPage] = useState(1)

  const limit = 10

  const { data, isLoading, error, refetch } = useGetUsers({ page, limit })

  const users = data?.data ?? []
  const pagination = data?.pagination

  if (isLoading) {
    return (
      <div className="flex justify-center items-center gap-2 mt-70">
        <Spinner className="w-7 h-7" />
        <span className="text-lg">Ucitavanje korisnika...</span>
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
      <h1 className="text-xl font-bold">Lista korisnika</h1>
      <div className="flex justify-between items-center my-4">
        <ButtonGroup className="w-[15rem]">
          <InputGroup>
            <InputGroupInput type="text" placeholder="Pretraga..." />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
          <Button variant="outline" aria-label="Search">
            <ArrowRightIcon />
          </Button>
        </ButtonGroup>
        <CreateUser params={{ page, limit }} />
      </div>
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Korisničko ime</TableHead>
            <TableHead>Email adresa</TableHead>
            <TableHead>Uloga</TableHead>
            <TableHead>Kreirano</TableHead>
            <TableHead>Ažurirano</TableHead>
            <TableHead className="text-right">Akcije</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                Nema korisnika
              </TableCell>
            </TableRow>
          )}
          {users.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {(page - 1) * limit + index + 1}
              </TableCell>
              <TableCell>
                <StatusColumn user={user} refetchUsers={refetch} />
              </TableCell>
              <TableCell className="font-medium">{user.username}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="rounded-sm">
                  {user.email}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={`${getRole[user.role].color} text-white`}>
                  {getRole[user.role].name}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(user.createdAt ?? new Date()).toLocaleDateString(
                  'hr-HR',
                  {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  },
                )}
              </TableCell>
              <TableCell>
                {user.updatedAt
                  ? new Date(user.updatedAt).toLocaleDateString('hr-HR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })
                  : '/'}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon">
                    <PencilIcon className="text-orange-500" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2Icon className="text-red-500" />
                  </Button>
                </div>
              </TableCell>
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
