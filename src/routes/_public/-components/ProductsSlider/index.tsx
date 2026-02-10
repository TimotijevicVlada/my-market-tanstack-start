import { Link } from '@tanstack/react-router'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ProductCard } from './ProductCard'
import type { featuredProducts } from '../..'
import { Button } from '@/components/custom/Button'

export const ProductSlider = ({
  title,
  products,
  viewAllHref = '#',
}: {
  title: string
  products: typeof featuredProducts
  viewAllHref?: string
}) => {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [maxScroll, setMaxScroll] = useState(0)
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef) return
    const updateMaxScroll = () => {
      setMaxScroll(containerRef.scrollWidth - containerRef.clientWidth)
    }
    updateMaxScroll()
    window.addEventListener('resize', updateMaxScroll)
    return () => window.removeEventListener('resize', updateMaxScroll)
  }, [containerRef])

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef) return
    const scrollAmount = containerRef.clientWidth * 0.7
    const newPosition =
      direction === 'left'
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(maxScroll, scrollPosition + scrollAmount)
    containerRef.scrollTo({ left: newPosition, behavior: 'smooth' })
    setScrollPosition(newPosition)
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          <Link
            to={viewAllHref}
            className="mr-2 flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            Pogledaj sve
            <ArrowRight className="size-4" />
          </Link>
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-full bg-transparent"
            onClick={() => scroll('left')}
            disabled={scrollPosition <= 0}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-full bg-transparent"
            onClick={() => scroll('right')}
            disabled={scrollPosition >= maxScroll}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
      <div
        ref={setContainerRef}
        className="scrollbar-hide flex gap-4 overflow-x-auto scroll-smooth"
        onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[220px] flex-shrink-0 md:w-[240px] lg:w-[260px]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}
