import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { getCategories } from '@/api/categories/server'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel.tsx'
import { Card } from '@/components/ui/card'

export const Route = createFileRoute('/')({
  component: App,
  loader: async () => await getCategories(),
})

export function App() {
  const categories = useLoaderData({ from: '/' })

  return (
    <div className="min-h-screen flex justify-center">
      <section className="flex  gap-4 pt-5 h-full w-5xl">
        <Carousel
          opts={{
            align: 'start',
            slidesToScroll: 3,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2">
            {categories.map((category) => (
              <CarouselItem key={category.id} className="pl-2 basis-auto">
                <div className="p-1">
                  <Card className="whitespace-nowrap h-12 flex items-center justify-center py-0 shadow-none">
                    <span className="text-l font-semibold px-4">
                      {category.name}
                    </span>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
    </div>
  )
}
