import { SearchIcon } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'
import { getCategories } from '@/api/categories/server'
import { CategoryItem } from '@/components/shared/CategoryItem'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'

export const Route = createFileRoute('/_public/categories/')({
  component: RouteComponent,
  loader: async () =>
    await getCategories({ data: { rootCategoriesOnly: true } }),
})

function RouteComponent() {
  const allCategories = Route.useLoaderData()

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-6 py-10">
      <h1 className="text-2xl font-bold">Sve kategorije</h1>
      <InputGroup className="max-w-xs">
        <InputGroupInput type="text" placeholder="Pretraga kategorija..." />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {allCategories.map((cat) => (
          <CategoryItem key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  )
}
