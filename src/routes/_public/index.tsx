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

export const Route = createFileRoute('/_public/')({
  component: App,
  loader: async () =>
    await getCategories({ data: { rootCategoriesOnly: true } }),
})

export function App() {
  const categories = useLoaderData({ from: '/_public/' })

  return (
    <div className="min-h-screen flex justify-center">
      <section className="flex gap-4 h-full w-5xl">
        <Carousel
          opts={{
            align: 'start',
            slidesToScroll: 3,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-1">
            {categories.map((category) => (
              <CarouselItem key={category.id} className="pl-1 basis-auto">
                <div className="p-0.5">
                  <Card className="rounded-md whitespace-nowrap h-8 flex items-center justify-center py-0 shadow-none">
                    <span className="text-sm font-semibold px-4">
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
