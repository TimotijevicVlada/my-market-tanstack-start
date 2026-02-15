import { Link } from '@tanstack/react-router'
import { Route } from '../../$productId'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'

export const RelatedProducts = () => {
  const product = Route.useLoaderData()

  return (
    <div className="mt-5">
      <h2 className="text-2xl font-bold">Još proizvoda ovog prodavca</h2>
      <Carousel
        className="w-full mt-2"
        opts={{
          containScroll: 'keepSnaps',
          dragFree: true,
        }}
      >
        <CarouselContent className="-ml-3">
          {product.relatedProducts.map((p) => (
            <CarouselItem key={p.id} className="basis-1/3 pl-3 sm:basis-1/6">
              <div
                className={cn(
                  'relative aspect-square w-full overflow-hidden rounded-lg transition-all',
                )}
              >
                <Link
                  to={`/seller/products/preview/$productId`}
                  params={{ productId: p.id }}
                >
                  <img
                    src={p.image.url}
                    alt={p.name}
                    className="object-cover"
                  />
                </Link>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
