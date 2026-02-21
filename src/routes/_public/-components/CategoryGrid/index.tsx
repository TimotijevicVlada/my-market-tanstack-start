import { ArrowRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Route } from '../..'
import { CategoryItem } from '@/components/shared/CategoryItem'

export const CategoryGrid = () => {
  const allCategories = Route.useLoaderData()

  const featuredCategories = allCategories.filter((cat) => cat.featured)

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Pregledaj kategorije</h2>
        <Link
          to={'/categories'}
          className="mr-2 flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          Pogledaj sve
          <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {featuredCategories.slice(0, 6).map((cat) => (
          <CategoryItem key={cat.id} category={cat} />
        ))}
      </div>
    </section>
  )
}
