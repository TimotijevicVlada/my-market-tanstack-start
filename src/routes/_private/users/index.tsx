import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowRightIcon,
  PlusIcon,
  SearchIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import { getRole } from './-data'
import { StatusColumn } from './-components/StatusColumn'
import { CreateUser } from './-components/CreateUser'
import { DeleteUser } from './-components/DeleteUser'
import { EditUser } from './-components/EditUser'
import { EditPassword } from './-components/EditPassword'
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
import { EmptyData } from '@/components/custom/EmptyData'
import { formatDate } from '@/utils/format-date'

export const Route = createFileRoute('/_private/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [page, setPage] = useState(1)
  const limit = 10

  const [searchInputValue, setSearchInputValue] = useState('')
  const [keyword, setKeyword] = useState('')
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false)

  const params = { page, limit, keyword }

  const { data, isLoading, error, refetch } = useGetUsers(params)

  const users = data?.data ?? []
  const pagination = data?.pagination

  const handleSearch = () => {
    setKeyword(searchInputValue)
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
        <ButtonGroup className="w-[15rem]">
          <InputGroup>
            <InputGroupInput
              type="text"
              placeholder="Pretraga..."
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
          <Button
            variant="outline"
            aria-label="Search"
            onClick={() => handleSearch()}
          >
            <ArrowRightIcon />
          </Button>
        </ButtonGroup>
        <CreateUser
          params={params}
          isOpen={isCreateUserModalOpen}
          setIsOpen={setIsCreateUserModalOpen}
        />
      </div>
      <Table className="overflow-x-auto">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Korisničko ime</TableHead>
            <TableHead>Email adresa</TableHead>
            <TableHead>Uloga</TableHead>
            <TableHead>Broj proizvoda</TableHead>
            <TableHead>Kreirano</TableHead>
            <TableHead>Ažurirano</TableHead>
            <TableHead className="text-right">Akcije</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center text-muted-foreground"
              >
                <EmptyData
                  title="Nema korisnika"
                  description="Jos uvek nema korisnika, dodajte prvog."
                  button={{
                    text: 'Dodaj korisnika',
                    icon: <PlusIcon />,
                    onClick: () => {
                      setIsCreateUserModalOpen(true)
                      setKeyword('')
                      setSearchInputValue('')
                      setPage(1)
                    },
                  }}
                />
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
              <TableCell>{user.productCount}</TableCell>
              <TableCell>{formatDate(user.createdAt)}</TableCell>
              <TableCell>{formatDate(user.updatedAt)}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <EditPassword userId={user.id} params={params} />
                  <EditUser user={user} params={params} />
                  <DeleteUser userId={user.id} params={params} />
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
