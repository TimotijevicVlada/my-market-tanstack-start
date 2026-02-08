import { ChevronLeftIcon, ChevronRight } from 'lucide-react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Images } from './-components/Images'
import { ProductInfo } from './-components/ProductInfo'
import { Description } from './-components/Description'
import { RelatedProducts } from './-components/RelatedProducts'
import { Separator } from '@/components/ui/separator'
import { getProductById } from '@/api/products/server'

export const Route = createFileRoute(
  '/_private/seller/products/preview/$productId',
)({
  component: ProductPreview,
  loader: async ({ params }) => {
    const { productId } = params
    const product = await getProductById({
      data: { productId },
    })
    return product
  },
})

export function ProductPreview() {
  const product = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Seller Preview Banner */}
        <div>
          <Link to="/seller/products">
            <div className="flex items-center gap-2">
              <ChevronLeftIcon />
              <h1 className="text-2xl font-bold">Pregled proizvoda</h1>
            </div>
          </Link>
          <p className="mt-1 text-muted-foreground">
            Ovako kupci vide vaš proizvod
          </p>
        </div>
        <Separator className="mt-1 mb-5" />

        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <span className="hover:text-foreground cursor-pointer">Početna</span>
          <ChevronRight className="size-4" />
          <span className="hover:text-foreground cursor-pointer">
            {product.categoryName}
          </span>
          <ChevronRight className="size-4" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image Gallery Section */}
          <Images />

          {/* Product Info Section */}
          <ProductInfo />
        </div>

        {/* Description Section */}
        <Description />

        <RelatedProducts />
      </div>
    </div>
  )
}
