import { useEffect, useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/custom/Button'

export const Banner = () => {
  const [currentBanner, setCurrentBanner] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % heroBanners.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative overflow-hidden h-[17.5rem] md:h-[23.75rem]">
      {heroBanners.map((banner, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === currentBanner
              ? 'opacity-100'
              : 'pointer-events-none opacity-0'
          }`}
        >
          <img
            src={banner.image}
            alt={banner.title}
            className="object-cover w-full h-full"
          />
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
                <Button size="lg" className="gap-2 text-base font-semibold">
                  {banner.cta}
                  <ArrowRight className="size-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Banner Dots */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {heroBanners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentBanner(i)}
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
        onClick={() =>
          setCurrentBanner(
            (prev) => (prev - 1 + heroBanners.length) % heroBanners.length,
          )
        }
      >
        <ChevronLeft className="size-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 size-10 -translate-y-1/2 rounded-full bg-background/30 backdrop-blur-sm hover:bg-background/50"
        onClick={() =>
          setCurrentBanner((prev) => (prev + 1) % heroBanners.length)
        }
      >
        <ChevronRight className="size-5" />
      </Button>
    </section>
  )
}

const heroBanners = [
  {
    image: '/banner1.png',
    title: 'Otkrijte najbolje proizvode',
    subtitle: 'Hiljadama prodavaca, milioni proizvoda - sve na jednom mestu',
    cta: 'Pogledaj ponudu',
  },
  {
    image: '/banner2.jpg',
    title: 'Zimska rasprodaja',
    subtitle: 'Do 50% popusta na odabrane proizvode iz svih kategorija',
    cta: 'Kupi sada',
  },
]
