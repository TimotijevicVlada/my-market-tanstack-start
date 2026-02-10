import { Heart, ShoppingCart, Star } from 'lucide-react'
import type { featuredProducts } from '@/routes/_public'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/custom/Button'

export const ProductCard = ({
  product,
}: {
  product: (typeof featuredProducts)[0]
}) => {
  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) *
          100,
      )
    : null

  return (
    <Card className="group relative overflow-hidden border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 p-0 gap-0">
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

function formatPrice(cents: number, currency: string) {
  const amount = cents.toLocaleString('sr-RS')
  const symbols: Record<string, string> = { RSD: 'din', EUR: '€', USD: '$' }
  return `${amount} ${symbols[currency] || currency}`
}
