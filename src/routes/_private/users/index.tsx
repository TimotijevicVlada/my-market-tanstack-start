import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { getRole } from './-data'
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
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_private/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading, error } = useGetUsers({ page, limit })

  const users = data?.data ?? []
  const pagination = data?.pagination

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      <div className="flex justify-between items-center my-4">
        <h1 className="text-xl font-bold">Lista korisnika</h1>
        {pagination && (
          <Button variant="outline">
            <PlusIcon />
            Dodaj korisnika
          </Button>
        )}
      </div>
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Korisničko ime</TableHead>
            <TableHead>Email adresa</TableHead>
            <TableHead>Uloga</TableHead>
            <TableHead>Kreirano</TableHead>
            <TableHead>Ažurirano</TableHead>
            <TableHead className="text-right">Akcije</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 && !isLoading && (
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
              <TableCell className="font-medium">{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
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
                {new Date(user.updatedAt ?? new Date()).toLocaleDateString(
                  'hr-HR',
                  {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  },
                )}
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
