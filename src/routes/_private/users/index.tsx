import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { FilterIcon, MailIcon, TriangleAlertIcon } from 'lucide-react'
import {
  getRole,
  roleFilterOptions,
  statusFilterOptions,
  usersColumns,
} from './-data'
import { StatusColumn } from './-components/StatusColumn'
import { CreateUser } from './-components/CreateUser'
import { DeleteUser } from './-components/DeleteUser'
import { EditUser } from './-components/EditUser'
import { EditPassword } from './-components/EditPassword'
import type { GetUsersParams, UserRole, UserStatus } from '@/api/users/types'
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
import { Spinner } from '@/components/ui/spinner'
import { EmptyData } from '@/components/custom/EmptyData'
import { formatDate } from '@/utils/format-date'
import { DropdownMenu } from '@/components/custom/DropdownMenu'
import { TableSearch } from '@/components/custom/TableSearch'

export const Route = createFileRoute('/_private/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [page, setPage] = useState(1)
  const limit = 10

  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState<UserStatus | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)

  const params: GetUsersParams = { page, limit, keyword, status, role }

  const { data, isLoading, error, refetch } = useGetUsers(params)

  const users = data?.data ?? []
  const pagination = data?.pagination

  const handleSearch = (searchValue: string) => {
    setKeyword(searchValue)
    setPage(1)
  }

  const handleStatusChange = (newStatus: { id: UserStatus; label: string }) => {
    setStatus(newStatus.id === status ? null : newStatus.id)
    setPage(1)
  }

  const handleRoleChange = (newRole: { id: UserRole; label: string }) => {
    setRole(newRole.id === role ? null : newRole.id)
    setPage(1)
  }

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
        <TableSearch onSearchClick={handleSearch} />
        <CreateUser params={params} />
      </div>
      <Table className="overflow-x-auto">
        <TableHeader className="bg-muted">
          <TableRow>
            {usersColumns.map(({ label, key, options }) => {
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
              if (key === 'role') {
                return (
                  <TableHead
                    key={key}
                    {...options}
                    className="flex items-center gap-3"
                  >
                    {label}
                    <DropdownMenu
                      options={roleFilterOptions}
                      handleOptionChange={handleRoleChange}
                      labelKey="label"
                      active={{ key: 'id', value: role }}
                      triggerButton={
                        <Button
                          variant="ghost"
                          aria-label="Open menu"
                          size="icon-sm"
                        >
                          <FilterIcon
                            className={`w-3.5 h-3.5 text-${role ? 'primary' : 'muted-foreground'}`}
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
          {users.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center text-muted-foreground"
              >
                <EmptyData title="Nema korisnika" />
              </TableCell>
            </TableRow>
          )}
          {users.map((user, index) => (
            <TableRow key={user.id}>
              {usersColumns.map(({ key }) => {
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
                      <StatusColumn user={user} refetchUsers={refetch} />
                    </TableCell>
                  )
                }
                if (key === 'email') {
                  return (
                    <TableCell key={key}>
                      <Badge variant="secondary" className="rounded-sm">
                        <MailIcon className="w-3.5! h-3.5!" />
                        {user[key]}
                      </Badge>
                    </TableCell>
                  )
                }
                if (key === 'role') {
                  return (
                    <TableCell key={key}>
                      <Badge
                        className={`${getRole[user[key]].color} text-white`}
                      >
                        {getRole[user[key]].name}
                      </Badge>
                    </TableCell>
                  )
                }
                if (key === 'createdAt' || key === 'updatedAt') {
                  return (
                    <TableCell key={key}>{formatDate(user[key])}</TableCell>
                  )
                }
                if (key === 'actions') {
                  return (
                    <TableCell key={key}>
                      <div className="flex justify-end gap-1">
                        <EditPassword userId={user.id} params={params} />
                        <EditUser user={user} params={params} />
                        <DeleteUser user={user} params={params} />
                      </div>
                    </TableCell>
                  )
                }
                return <TableCell key={key}>{user[key]}</TableCell>
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
