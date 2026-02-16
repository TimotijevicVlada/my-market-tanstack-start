import { useEffect, useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useGetActiveBannersByPlacement } from '@/api/banners/queries'
import { Button } from '@/components/ui/button'

const BANNER_INTERVAL_MS = 6000

export const Banner = () => {
  const [currentBanner, setCurrentBanner] = useState(0)
  const [intervalResetKey, setIntervalResetKey] = useState(0)

  const { data: activeBanner } = useGetActiveBannersByPlacement('home')

  const activeBannerLength = activeBanner?.length ?? 0

  useEffect(() => {
    if (activeBannerLength === 0) return
    setCurrentBanner((prev) => (prev < activeBannerLength ? prev : 0))
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % activeBannerLength)
    }, BANNER_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [activeBannerLength, intervalResetKey])

  return (
    <section className="relative overflow-hidden w-full aspect-[5/1]">
      {activeBanner?.map((banner, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 size-full ${
            i === currentBanner
              ? 'opacity-100'
              : 'pointer-events-none opacity-0'
          }`}
        >
          <img src={banner.imageUrl} alt={banner.title} className="size-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-7xl px-6">
              <div className="max-w-xl space-y-4">
                <h1 className="text-balance text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                  {banner.title}
                </h1>
                <p className="text-pretty text-lg text-muted-foreground md:text-xl">
                  {banner.subtitle}
                </p>
                <Button
                  size="lg"
                  className="gap-2 text-base font-semibold"
                  asChild
                >
                  <Link to={banner.ctaHref}>
                    {banner.ctaLabel}
                    <ArrowRight className="size-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Banner Dots */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {activeBanner?.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrentBanner(i)
              setIntervalResetKey((k) => k + 1)
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === currentBanner ? 'w-8 bg-primary' : 'w-2 bg-foreground/30'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Banner Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 size-10 -translate-y-1/2 rounded-full bg-background/30 backdrop-blur-sm hover:bg-background/50"
        onClick={() => {
          setCurrentBanner(
            (prev) => (prev - 1 + activeBannerLength) % activeBannerLength,
          )
          setIntervalResetKey((k) => k + 1)
        }}
      >
        <ChevronLeft className="size-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 size-10 -translate-y-1/2 rounded-full bg-background/30 backdrop-blur-sm hover:bg-background/50"
        onClick={() => {
          setCurrentBanner((prev) => (prev + 1) % activeBannerLength)
          setIntervalResetKey((k) => k + 1)
        }}
      >
        <ChevronRight className="size-5" />
      </Button>
    </section>
  )
}
