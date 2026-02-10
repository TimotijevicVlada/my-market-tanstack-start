import { Link } from '@tanstack/react-router'
import {
  Baby,
  BookOpen,
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

export const MoreCategories = () => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Još kategorija</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {categories.slice(6).map((cat) => {
          const Icon = cat.icon
          return (
            <Link
              key={cat.slug}
              to={`/`}
              className="group flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4 transition-all duration-300 hover:border-primary/40 hover:bg-primary/5"
            >
              <div className="flex size-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                <Icon className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold transition-colors group-hover:text-primary">
                  {cat.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {cat.count.toLocaleString('sr-RS')}
                </p>
              </div>
            </Link>
          )
        })}
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
