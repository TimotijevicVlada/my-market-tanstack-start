import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Route } from '../..'
import { Button } from '@/components/custom/Button'
import { categoryIconOptions } from '@/routes/_private/admin/categories/-data'

export const CategorySlider = () => {
  const allCategories = Route.useLoaderData()

  const [catScrollPos, setCatScrollPos] = useState(0)
  const [catMaxScroll, setCatMaxScroll] = useState(0)
  const [catContainer, setCatContainer] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!catContainer) return
    const update = () =>
      setCatMaxScroll(catContainer.scrollWidth - catContainer.clientWidth)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [catContainer])

  const scrollCategories = (direction: 'left' | 'right') => {
    if (!catContainer) return
    const amount = catContainer.clientWidth * 0.6
    const pos =
      direction === 'left'
        ? Math.max(0, catScrollPos - amount)
        : Math.min(catMaxScroll, catScrollPos + amount)
    catContainer.scrollTo({ left: pos, behavior: 'smooth' })
    setCatScrollPos(pos)
  }

  return (
    <section className="border-b border-border/50 bg-card/50">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-6 py-4">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 flex-shrink-0 rounded-full"
          onClick={() => scrollCategories('left')}
          disabled={catScrollPos <= 0}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <div
          ref={setCatContainer}
          className="scrollbar-hide flex gap-2 overflow-x-auto scroll-smooth"
          onScroll={(e) => setCatScrollPos(e.currentTarget.scrollLeft)}
        >
          {allCategories.map((cat) => {
            const Icon = categoryIconOptions[cat.icon]
            return (
              <Link
                key={cat.id}
                to="/categories/$slug"
                params={{ slug: cat.slug }}
                className="flex flex-shrink-0 items-center gap-2 rounded-full border border-border/50 bg-secondary/50 px-4 py-2 text-sm font-medium transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
              >
                <Icon className="size-4" />
                {cat.name}
              </Link>
            )
          })}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 flex-shrink-0 rounded-full"
          onClick={() => scrollCategories('right')}
          disabled={catScrollPos >= catMaxScroll}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </section>
  )
}
