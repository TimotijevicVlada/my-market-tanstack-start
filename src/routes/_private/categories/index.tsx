import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  ArrowRightIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
  TriangleAlertIcon,
} from 'lucide-react'
import { useGetCategories } from '@/api/categories/queries'
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
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Pagination } from '@/components/custom/Pagination'

export const Route = createFileRoute('/_private/categories/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [page, setPage] = useState(1)
  const limit = 10

  const [searchInputValue, setSearchInputValue] = useState('')

  const [keyword, setKeyword] = useState('')

  const params = { page, limit, keyword }

  const { data, isLoading, error } = useGetCategories(params)

  const categories = data?.data ?? []
  const pagination = data?.pagination

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
        <ButtonGroup className="w-[15rem]">
          <InputGroup>
            <InputGroupInput
              type="text"
              placeholder="Pretraga..."
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setKeyword(searchInputValue)
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
            onClick={() => setKeyword(searchInputValue)}
          >
            <ArrowRightIcon />
          </Button>
        </ButtonGroup>
        <Button>
          <PlusIcon />
          Kreiraj kategoriju
        </Button>
      </div>
      <Table className="overflow-x-auto">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Naziv</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Nadređena kategorija</TableHead>
            <TableHead>Opis</TableHead>
            <TableHead>Kreirano</TableHead>
            <TableHead>Ažurirano</TableHead>
            <TableHead className="text-right">Akcije</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 && (
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
                      // setIsCreateUserModalOpen(true)
                      setKeyword('')
                      setSearchInputValue('')
                      setPage(1)
                    },
                  }}
                />
              </TableCell>
            </TableRow>
          )}
          {categories.map((category, index) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">
                {(page - 1) * limit + index + 1}
              </TableCell>
              <TableCell>
                <Switch checked={true} />
              </TableCell>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="rounded-sm">
                  {category.slug}
                </Badge>
              </TableCell>
              <TableCell>{category.parentName ?? '/'}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell>
                {new Date(category.createdAt ?? new Date()).toLocaleDateString(
                  'hr-HR',
                  {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  },
                )}
              </TableCell>
              <TableCell>
                {category.updatedAt
                  ? new Date(category.updatedAt).toLocaleDateString('hr-HR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })
                  : '/'}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon">
                    <PencilIcon color="orange" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2Icon color="red" />
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
