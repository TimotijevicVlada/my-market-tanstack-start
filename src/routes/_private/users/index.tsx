import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { MailIcon } from 'lucide-react'
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
import type {
  GetUsersParams,
  SortableUserColumns,
  UserRole,
  UserSort,
  UserStatus,
} from '@/api/users/types'
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
import { formatDate } from '@/utils/format-date'
import { TableSearch } from '@/components/custom/TableSearch'
import { TableFilter } from '@/components/custom/Table/TableFilter'
import { TableSort } from '@/components/custom/Table/TableSort'
import { TableLoading } from '@/components/custom/Table/TableLoading'
import { TableError } from '@/components/custom/Table/TableError'
import { TableEmptyHolder } from '@/components/custom/Table/TableEmptyHolder'

export const Route = createFileRoute('/_private/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [page, setPage] = useState(1)
  const limit = 10

  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState<UserStatus | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [sort, setSort] = useState<UserSort>({
    key: 'createdAt',
    order: 'desc',
  })

  const params: GetUsersParams = { page, limit, keyword, status, role, sort }

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

  const handleSort = (key: SortableUserColumns) => {
    setSort((prev) => ({
      key,
      order: prev.key === key ? (prev.order === 'asc' ? 'desc' : 'asc') : 'asc',
    }))
    setPage(1)
  }

  if (isLoading) {
    return <TableLoading label="Učitavanje korisnika..." />
  }

  if (error) {
    return <TableError error={error.message} />
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
              if (key === 'role') {
                return (
                  <TableFilter
                    label={label}
                    dropdownProps={{
                      options: roleFilterOptions,
                      handleOptionChange: handleRoleChange,
                      labelKey: 'label',
                      active: { key: 'id', value: role },
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
                    {key !== 'order' && key !== 'actions' && (
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
          {users.length === 0 && (
            <TableEmptyHolder
              colSpan={usersColumns.length}
              title="Nema korisnika"
            />
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
