import { createFileRoute } from '@tanstack/react-router'
import { Banner } from './-components/Banner'
import { CategorySlider } from './-components/CategorySlider'
import { TrustBadges } from './-components/TrustBadges'
import { ProductSlider } from './-components/ProductsSlider'
import { CategoryGrid } from './-components/CategoryGrid'
import { PromotionBanner } from './-components/PromotionBanner'
import { MoreCategories } from './-components/MoreCategories'
import { Newsletter } from './-components/Newsletter'
import { ScrollToTopButton } from './-components/ScrollToTopButton'
import { getCategories } from '@/api/categories/server'
import { Footer } from '@/layout/Footer'

export const Route = createFileRoute('/_public/')({
  loader: async () =>
    await getCategories({ data: { rootCategoriesOnly: true } }),
  component: MarketplaceLanding,
})

export function MarketplaceLanding() {
  return (
    <div className="min-h-screen bg-background">
      <Banner />

      <CategorySlider />

      <TrustBadges />

      <div className="mx-auto max-w-7xl space-y-12 px-6 py-10">
        <ProductSlider
          title="Istaknuti proizvodi"
          products={featuredProducts}
          viewAllHref="/istaknuti"
        />

        <CategoryGrid />

        <PromotionBanner />

        <ProductSlider
          title="U trendu"
          products={trendingProducts}
          viewAllHref="/u-trendu"
        />

        <MoreCategories />

        <Newsletter />
      </div>

      <Footer />

      <ScrollToTopButton />
    </div>
  )
}

export const featuredProducts = [
  {
    id: '1',
    name: 'Domaći med od lipe - 1kg',
    price: 1200,
    compareAtPrice: 1500,
    currency: 'RSD',
    image: '/product1.jpg',
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
    image: '/product2.jpg',
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
    image: '/product3.webp',
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
    image: '/product4.webp',
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
    image: '/product5.jpg',
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
    image: '/product1.jpg',
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
    image: '/product2.jpg',
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
    image: '/product3.webp',
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
    image: '/product4.webp',
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
    image: '/product5.jpg',
    rating: 4.8,
    ratingCount: 92,
    seller: 'Juvelir M',
    category: 'Nakit i satovi',
    isNew: false,
  },
]
