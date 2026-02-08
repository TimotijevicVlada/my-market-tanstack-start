import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Route } from '../../$productId'
import { statusBadgeConfig } from './data'
import type { CarouselApi } from '@/components/ui/carousel'
import { Badge } from '@/components/ui/badge'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { Button } from '@/components/custom/Button'
import { cn } from '@/lib/utils'

export const Images = () => {
  const product = Route.useLoaderData()

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [mainApi, setMainApi] = useState<CarouselApi>()
  const [thumbApi, setThumbApi] = useState<CarouselApi>()

  const discountPercentage = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) *
          100,
      )
    : 0

  const onMainSelect = useCallback(() => {
    if (!mainApi || !thumbApi) return
    setSelectedImageIndex(mainApi.selectedScrollSnap())
    thumbApi.scrollTo(mainApi.selectedScrollSnap())
  }, [mainApi, thumbApi])

  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainApi) return
      mainApi.scrollTo(index)
      setSelectedImageIndex(index)
    },
    [mainApi],
  )

  useEffect(() => {
    if (!mainApi) return
    onMainSelect()
    mainApi.on('select', onMainSelect)
    return () => {
      mainApi.off('select', onMainSelect)
    }
  }, [mainApi, onMainSelect])

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card">
        {discountPercentage > 0 && (
          <Badge className="absolute left-4 top-4 z-10 bg-destructive text-destructive-foreground">
            -{discountPercentage}%
          </Badge>
        )}

        <Badge
          variant="outline"
          className={cn(
            'absolute right-4 top-4 z-10',
            statusBadgeConfig[product.status].className,
          )}
        >
          {statusBadgeConfig[product.status].label}
        </Badge>

        <Carousel className="w-full" opts={{ loop: true }} setApi={setMainApi}>
          <CarouselContent>
            {product.images.map((image) => (
              <CarouselItem key={image.id}>
                <div className="group relative aspect-square cursor-zoom-in overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.alt ?? 'Slika proizvoda'}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100">
                    <div className="flex size-12 items-center justify-center rounded-full bg-white/90">
                      <ZoomIn className="size-5 text-black/80" />
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Arrows */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-4 top-1/2 z-10 size-10 -translate-y-1/2 rounded-full bg-background/80 shadow-lg backdrop-blur-sm hover:bg-background"
            onClick={() => mainApi?.scrollPrev()}
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 top-1/2 z-10 size-10 -translate-y-1/2 rounded-full bg-background/80 shadow-lg backdrop-blur-sm hover:bg-background"
            onClick={() => mainApi?.scrollNext()}
          >
            <ChevronRight className="size-5" />
          </Button>
        </Carousel>
      </div>

      {/* Thumbnail Carousel */}
      <Carousel
        className="w-full"
        opts={{
          containScroll: 'keepSnaps',
          dragFree: true,
        }}
        setApi={setThumbApi}
      >
        <CarouselContent className="-ml-2">
          {product.images.map((image, index) => (
            <CarouselItem
              key={image.id}
              className="basis-1/4 pl-2 sm:basis-1/5"
            >
              <button
                onClick={() => onThumbClick(index)}
                className={cn(
                  'relative aspect-square w-full overflow-hidden rounded-lg border-2 transition-all',
                  selectedImageIndex === index
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-border/50 hover:border-border',
                )}
              >
                <img
                  src={image.url}
                  alt={image.alt ?? `Slika proizvoda ${index + 1}`}
                  className="object-cover"
                />
                {selectedImageIndex !== index && (
                  <div className="absolute inset-0 bg-black/20" />
                )}
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
