import { useEffect, useState } from 'react'
import {
  ArrowRight,
  Baby,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  CreditCard,
  Dumbbell,
  Facebook,
  Gem,
  Heart,
  Home,
  Instagram,
  Laptop,
  Leaf,
  Mail,
  MapPin,
  Music,
  Paintbrush,
  Phone,
  ShieldCheck,
  Shirt,
  ShoppingCart,
  Star,
  Truck,
  Twitter,
  Utensils,
} from 'lucide-react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getCategories } from '@/api/categories/server'

export const Route = createFileRoute('/_public/')({
  loader: async () =>
    await getCategories({ data: { rootCategoriesOnly: true } }),
  component: MarketplaceLanding,
})

// -- Main Landing Page --
export function MarketplaceLanding() {
  const [currentBanner, setCurrentBanner] = useState(0)
  const [catScrollPos, setCatScrollPos] = useState(0)
  const [catMaxScroll, setCatMaxScroll] = useState(0)
  const [catContainer, setCatContainer] = useState<HTMLDivElement | null>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Auto-rotate hero banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % heroBanners.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  // Category scroll setup
  useEffect(() => {
    if (!catContainer) return
    const update = () =>
      setCatMaxScroll(catContainer.scrollWidth - catContainer.clientWidth)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [catContainer])

  // Scroll to top button
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    <div className="min-h-screen bg-background">
      {/* Hero Banner Carousel */}
      <section className="relative h-[320px] overflow-hidden md:h-[420px] lg:h-[480px]">
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

      {/* Category Slider */}
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

      {/* Trust Badges */}
      <section className="border-b border-border/50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 py-6 md:grid-cols-4">
          {[
            {
              icon: Truck,
              title: 'Besplatna dostava',
              desc: 'Za porudžbine preko 5.000 din',
            },
            {
              icon: ShieldCheck,
              title: 'Sigurna kupovina',
              desc: '100% zaštita kupca',
            },
            {
              icon: CreditCard,
              title: 'Sigurno plaćanje',
              desc: 'Karticom ili pouzećem',
            },
            { icon: Clock, title: 'Brza dostava', desc: '2-5 radnih dana' },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl space-y-12 px-6 py-10">
        {/* Featured Products */}
        <ProductSlider
          title="Istaknuti proizvodi"
          products={featuredProducts}
          viewAllHref="/istaknuti"
        />

        {/* Category Grid */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Pregledaj kategorije</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {categories.slice(0, 6).map((cat) => {
              const Icon = cat.icon
              return (
                <Link
                  key={cat.slug}
                  to={`/`}
                  className="group flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-card p-5 transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                    <Icon className="size-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold transition-colors group-hover:text-primary">
                      {cat.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {cat.count.toLocaleString('sr-RS')} proizvoda
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Promotion Banner */}
        <section className="relative overflow-hidden rounded-2xl">
          <img
            src="../../../public/become-seller-banner.avif"
            alt="Promocija"
            className="h-[200px] w-full object-cover md:h-[280px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent" />
          <div className="absolute inset-0 flex items-center p-8 md:p-12">
            <div className="max-w-md space-y-3">
              <Badge className="bg-primary/20 text-primary">
                Posebna ponuda
              </Badge>
              <h2 className="text-balance text-2xl font-bold md:text-3xl">
                Postani prodavac i zarađuj od kuće
              </h2>
              <p className="text-pretty text-sm text-muted-foreground md:text-base">
                Pridruži se hiljadama uspešnih prodavaca na našoj platformi.
                Besplatno otvaranje prodavnice!
              </p>
              <Button className="gap-2">
                Otvori prodavnicu
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Trending Products */}
        <ProductSlider
          title="U trendu"
          products={trendingProducts}
          viewAllHref="/u-trendu"
        />

        {/* More Categories */}
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

        {/* Newsletter / CTA */}
        <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-8 text-center md:p-12">
          <h2 className="text-balance text-2xl font-bold md:text-3xl">
            Budite u toku sa najboljim ponudama
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-pretty text-muted-foreground">
            Prijavite se na naš newsletter i prvi saznajte za nove proizvode,
            popuste i ekskluzivne ponude.
          </p>
          <div className="mx-auto mt-6 flex max-w-md gap-2">
            <input
              type="email"
              placeholder="Vaša email adresa"
              className="flex-1 rounded-lg border border-border bg-input px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Button className="flex-shrink-0">Prijavi se</Button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">
                  M
                </div>
                <div>
                  <p className="font-bold">My marketplace</p>
                  <p className="text-xs text-muted-foreground">
                    Vaš online tržni centar
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Najveći marketplace u regionu sa hiljadama prodavaca i milionima
                proizvoda. Kupujte sigurno, plaćajte jednostavno.
              </p>
              <div className="flex gap-3">
                <Link
                  to="/"
                  className="flex size-9 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <Facebook className="size-4" />
                </Link>
                <Link
                  to="/"
                  className="flex size-9 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <Instagram className="size-4" />
                </Link>
                <Link
                  to="/"
                  className="flex size-9 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <Twitter className="size-4" />
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="font-semibold">Brzi linkovi</h3>
              <ul className="space-y-2.5 text-sm">
                {[
                  'Početna',
                  'Sve kategorije',
                  'Istaknuti proizvodi',
                  'Nove ponude',
                  'Postani prodavac',
                ].map((link) => (
                  <li key={link}>
                    <Link
                      to="/"
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help */}
            <div className="space-y-4">
              <h3 className="font-semibold">Pomoć i podrška</h3>
              <ul className="space-y-2.5 text-sm">
                {[
                  'Česta pitanja',
                  'Uslovi korišćenja',
                  'Politika privatnosti',
                  'Reklamacije i povraćaj',
                  'Kontaktirajte nas',
                ].map((link) => (
                  <li key={link}>
                    <Link
                      to="/"
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="font-semibold">Kontakt</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-4 flex-shrink-0 text-primary" />
                  Beograd, Srbija
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="size-4 flex-shrink-0 text-primary" />
                  +381 11 123 4567
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="size-4 flex-shrink-0 text-primary" />
                  podrska@marketplace.rs
                </li>
              </ul>
              <div className="rounded-lg border border-border/50 bg-secondary/50 p-3">
                <p className="text-xs font-medium">Radno vreme podrške</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Pon - Pet: 09:00 - 17:00
                </p>
                <p className="text-xs text-muted-foreground">
                  Sub: 09:00 - 14:00
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 md:flex-row">
            <p className="text-xs text-muted-foreground">
              &copy; 2026 My marketplace. Sva prava zadržana.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <Link to="/" className="transition-colors hover:text-primary">
                Uslovi korišćenja
              </Link>
              <Link to="/" className="transition-colors hover:text-primary">
                Politika privatnosti
              </Link>
              <Link to="/" className="transition-colors hover:text-primary">
                Kolačići
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110"
          aria-label="Scroll to top"
        >
          <ChevronUp className="size-5" />
        </button>
      )}
    </div>
  )
}

// -- Helper --
function formatPrice(cents: number, currency: string) {
  const amount = cents.toLocaleString('sr-RS')
  const symbols: Record<string, string> = { RSD: 'din', EUR: '€', USD: '$' }
  return `${amount} ${symbols[currency] || currency}`
}

// -- Product Card Component --
function ProductCard({ product }: { product: (typeof featuredProducts)[0] }) {
  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) *
          100,
      )
    : null

  return (
    <Card className="group relative overflow-hidden border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNew && (
            <Badge className="bg-primary text-primary-foreground text-xs font-semibold">
              NOVO
            </Badge>
          )}
          {discount && (
            <Badge className="bg-destructive text-destructive-foreground text-xs font-semibold">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <Button
            size="icon"
            variant="secondary"
            className="size-8 rounded-full shadow-lg"
          >
            <Heart className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="size-8 rounded-full shadow-lg"
          >
            <ShoppingCart className="size-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <p className="mb-1 text-xs text-muted-foreground">{product.category}</p>
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-tight transition-colors group-hover:text-primary">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mb-3 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`size-3 ${
                  i < Math.floor(product.rating)
                    ? 'fill-primary text-primary'
                    : 'fill-muted text-muted'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {product.rating} ({product.ratingCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">
            {formatPrice(product.price, product.currency)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice, product.currency)}
            </span>
          )}
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">{product.seller}</p>
      </CardContent>
    </Card>
  )
}

// -- Product Slider Component --
function ProductSlider({
  title,
  products,
  viewAllHref = '#',
}: {
  title: string
  products: typeof featuredProducts
  viewAllHref?: string
}) {
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

// -- Hero Banner Data --
const heroBanners = [
  {
    image: '../../../public/banner1.png',
    title: 'Otkrijte najbolje proizvode',
    subtitle: 'Hiljadama prodavaca, milioni proizvoda - sve na jednom mestu',
    cta: 'Pogledaj ponudu',
  },
  {
    image: '../../../public/banner2.jpg',
    title: 'Zimska rasprodaja',
    subtitle: 'Do 50% popusta na odabrane proizvode iz svih kategorija',
    cta: 'Kupi sada',
  },
]

// -- Categories --
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

// -- Mock Products --
const featuredProducts = [
  {
    id: '1',
    name: 'Domaći med od lipe - 1kg',
    price: 1200,
    compareAtPrice: 1500,
    currency: 'RSD',
    image: '../../../public/product1.jpg',
    rating: 4.8,
    ratingCount: 124,
    seller: 'Pčelarstvo Jović',
    category: 'Hrana i piće',
    isNew: false,
  },
  {
    id: '2',
    name: 'Ručno pleteni šal od merino vune',
    price: 3500,
    compareAtPrice: null,
    currency: 'RSD',
    image: '../../../public/product2.jpg',
    rating: 4.9,
    ratingCount: 67,
    seller: 'Pletivo Studio',
    category: 'Moda i odeća',
    isNew: true,
  },
  {
    id: '3',
    name: 'Akustična gitara za početnike',
    price: 12990,
    compareAtPrice: 15990,
    currency: 'RSD',
    image: '../../../public/product3.webp',
    rating: 4.6,
    ratingCount: 203,
    seller: 'Muzička Radionica',
    category: 'Muzički instrumenti',
    isNew: false,
  },
  {
    id: '4',
    name: 'Set organskih začina - 12 komada',
    price: 2800,
    compareAtPrice: 3200,
    currency: 'RSD',
    image: '../../../public/product4.webp',
    rating: 4.7,
    ratingCount: 89,
    seller: 'Začini iz prirode',
    category: 'Hrana i piće',
    isNew: false,
  },
  {
    id: '5',
    name: 'Keramička vaza - ručni rad',
    price: 4500,
    compareAtPrice: null,
    currency: 'RSD',
    image: '../../../public/product5.jpg',
    rating: 5.0,
    ratingCount: 34,
    seller: 'Keramika Art',
    category: 'Umetnost i zanat',
    isNew: true,
  },
]

const trendingProducts = [
  {
    id: '6',
    name: 'Bluetooth slušalice Pro Max',
    price: 7990,
    compareAtPrice: 9990,
    currency: 'RSD',
    image: '../../../public/product1.jpg',
    rating: 4.5,
    ratingCount: 312,
    seller: 'Tech Store',
    category: 'Elektronika',
    isNew: false,
  },
  {
    id: '7',
    name: 'Yoga prostirka premium',
    price: 3200,
    compareAtPrice: null,
    currency: 'RSD',
    image: '../../../public/product2.jpg',
    rating: 4.8,
    ratingCount: 156,
    seller: 'Fit Life',
    category: 'Sport i rekreacija',
    isNew: false,
  },
  {
    id: '8',
    name: 'Dečiji edukativni set STEM',
    price: 5500,
    compareAtPrice: 6500,
    currency: 'RSD',
    image: '../../../public/product3.webp',
    rating: 4.9,
    ratingCount: 78,
    seller: 'Eduko Shop',
    category: 'Bebe i deca',
    isNew: true,
  },
  {
    id: '9',
    name: 'Prirodni sapun od lavande',
    price: 650,
    compareAtPrice: null,
    currency: 'RSD',
    image: '../../../public/product4.webp',
    rating: 4.7,
    ratingCount: 201,
    seller: 'Lavanda Farm',
    category: 'Prirodni proizvodi',
    isNew: false,
  },
  {
    id: '10',
    name: 'Srebrna ogrlica sa priveskom',
    price: 8900,
    compareAtPrice: 11000,
    currency: 'RSD',
    image: '../../../public/product5.jpg',
    rating: 4.8,
    ratingCount: 92,
    seller: 'Juvelir M',
    category: 'Nakit i satovi',
    isNew: false,
  },
]
