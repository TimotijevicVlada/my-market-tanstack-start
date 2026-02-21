import { createFileRoute } from '@tanstack/react-router'
import { getCategoryBySlug } from '@/api/categories/server'
import { CategoryItem } from '@/components/shared/CategoryItem'

export const Route = createFileRoute('/_public/categories/_category/$slug')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const category = await getCategoryBySlug({ data: { slug: params.slug } })
    return category
  },
})

function RouteComponent() {
  const { category, subcategories } = Route.useLoaderData()

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-6 py-10">
      <h1 className="text-2xl font-bold">{category.name}</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {subcategories.map((subcategory) => (
          <CategoryItem key={subcategory.id} category={subcategory} />
        ))}
      </div>
    </div>
  )
}
