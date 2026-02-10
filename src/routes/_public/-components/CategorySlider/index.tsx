import { useEffect, useState } from 'react'
import {
  Baby,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Gem,
  Home,
  Laptop,
  Leaf,
  Music,
  Paintbrush,
  Shirt,
  Utensils,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/custom/Button'

export const CategorySlider = () => {
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
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <Link
                key={cat.slug}
                to={`/`}
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

const categories = [
  { name: 'Hrana i piće', icon: Utensils, slug: 'hrana-i-pice', count: 1240 },
  { name: 'Moda i odeća', icon: Shirt, slug: 'moda-i-odeca', count: 3560 },
  {
    name: 'Muzički instrumenti',
    icon: Music,
    slug: 'muzicki-instrumenti',
    count: 890,
  },
  { name: 'Kuća i bašta', icon: Home, slug: 'kuca-i-basta', count: 2100 },
  {
    name: 'Kancelarija i škola',
    icon: BookOpen,
    slug: 'kancelarija-i-skola',
    count: 1870,
  },
  {
    name: 'Umetnost i zanat',
    icon: Paintbrush,
    slug: 'umetnost-i-zanat',
    count: 640,
  },
  { name: 'Elektronika', icon: Laptop, slug: 'elektronika', count: 4200 },
  {
    name: 'Sport i rekreacija',
    icon: Dumbbell,
    slug: 'sport-i-rekreacija',
    count: 1560,
  },
  { name: 'Bebe i deca', icon: Baby, slug: 'bebe-i-deca', count: 980 },
  {
    name: 'Prirodni proizvodi',
    icon: Leaf,
    slug: 'prirodni-proizvodi',
    count: 720,
  },
  { name: 'Nakit i satovi', icon: Gem, slug: 'nakit-i-satovi', count: 1340 },
]
