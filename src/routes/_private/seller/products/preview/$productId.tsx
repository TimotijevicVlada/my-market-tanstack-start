import { ChevronLeftIcon, ChevronRight } from 'lucide-react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Images } from './-components/Images'
import { ProductInfo } from './-components/ProductInfo'
import { Description } from './-components/Description'
import { ProductDetails } from './-components/ProductDetails'
import { SellerInfo } from './-components/SellerInfo'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute(
  '/_private/seller/products/preview/$productId',
)({
  component: ProductPreview,
})

export function ProductPreview() {
  const product = mockProduct

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

          <>
            <span className="hover:text-foreground cursor-pointer">
              {product.category.parentCategory.name}
            </span>
            <ChevronRight className="size-4" />
          </>

          <span className="hover:text-foreground cursor-pointer">
            {product.category.name}
          </span>
          <ChevronRight className="size-4" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image Gallery Section */}
          <Images product={mockProduct} />

          {/* Product Info Section */}
          <ProductInfo product={mockProduct} />
        </div>

        {/* Description Section */}
        <Description product={mockProduct} />

        {/* Additional Info */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Product Details */}
          <ProductDetails product={mockProduct} />

          {/* Seller Card */}
          <SellerInfo product={mockProduct} />
        </div>
      </div>
    </div>
  )
}

export const mockProduct = {
  id: 'prod-123',
  name: 'Premium Organic Extra Virgin Olive Oil',
  slug: 'premium-organic-extra-virgin-olive-oil',
  description: {
    type: 'doc' as const,
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Discover the rich, authentic taste of our Premium Organic Extra Virgin Olive Oil, cold-pressed from the finest hand-picked olives grown in the sun-drenched groves of the Mediterranean.',
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'This exceptional oil features a perfect balance of fruity notes with a subtle peppery finish, making it ideal for drizzling over salads, pasta, grilled vegetables, or fresh bread.',
          },
        ],
      },
      {
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: 'Key Features' }],
      },
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: '100% organic, certified by EU standards',
                  },
                ],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Cold-pressed within 24 hours of harvest',
                  },
                ],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Rich in antioxidants and healthy fats',
                  },
                ],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Perfect for cooking and finishing dishes',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  currency: 'RSD' as const,
  price: 249900, // 2499.00 RSD
  compareAtPrice: 349900, // 3499.00 RSD
  unit: 'liter' as const,
  trackInventory: true,
  stockQty: 47,
  lowStockThreshold: 10,
  sku: 'OLV-PREM-1L',
  categoryId: 'cat-food',
  category: {
    id: 'cat-food',
    name: 'Hrana i piće',
    parentCategory: {
      name: 'Organski proizvodi',
    },
  },
  seoTitle: 'Premium Organic Extra Virgin Olive Oil | My Marketplace',
  seoDescription:
    'Experience the finest cold-pressed organic olive oil. Perfect for cooking and finishing dishes.',
  status: 'published' as const,
  publishedAt: new Date('2024-01-15'),
  createdAt: new Date('2024-01-10'),
  updatedAt: new Date('2024-01-20'),
  seller: {
    id: 'seller-1',
    displayName: 'Mediterranean Delights',
    avatarUrl: '/placeholder.svg',
    ratingAvg: 4.8,
    ratingCount: 156,
  },
  images: [
    {
      id: 'img-1',
      url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&h=800&fit=crop',
      alt: 'Premium olive oil bottle front view',
      sortOrder: 0,
      isPrimary: true,
    },
    {
      id: 'img-2',
      url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=800&fit=crop',
      alt: 'Olive oil being poured',
      sortOrder: 1,
      isPrimary: false,
    },
    {
      id: 'img-3',
      url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&h=800&fit=crop',
      alt: 'Olive oil with bread',
      sortOrder: 2,
      isPrimary: false,
    },
    {
      id: 'img-4',
      url: 'https://images.unsplash.com/photo-1579275542618-a1dfed5f54ba?w=800&h=800&fit=crop',
      alt: 'Olive grove',
      sortOrder: 3,
      isPrimary: false,
    },
  ],
}
