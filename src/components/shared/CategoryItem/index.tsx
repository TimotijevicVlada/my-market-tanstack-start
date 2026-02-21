import { Link } from '@tanstack/react-router'
import type { Category } from '@/api/categories/types'
import { categoryIconOptions } from '@/routes/_private/admin/categories/-data'
import { Card } from '@/components/ui/card'

interface CategoryItemProps {
  category: Omit<Category, 'parentName'>
}

export const CategoryItem = ({ category }: CategoryItemProps) => {
  const Icon = categoryIconOptions[category.icon]

  return (
    <Link key={category.id} to="/categories/$slug" params={{ slug: category.slug }}>
      <Card className="flex flex-col h-full items-center gap-3 p-5 transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/5">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
          <Icon className="size-6 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold transition-colors group-hover:text-primary">
            {category.name}
          </p>
          {/* TODO: Add count of products */}
          <p className="mt-0.5 text-xs text-muted-foreground">450 proizvoda</p>
        </div>
      </Card>
    </Link>
  )
}
