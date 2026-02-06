import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Heart,
  Package,
  Share2,
  Shield,
  Star,
  Store,
  Tag,
  Truck,
} from 'lucide-react'
import type { mockProduct } from '../../$productId'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/custom/Button'
import { Card, CardContent } from '@/components/ui/card'

interface ProductInfoProps {
  product: typeof mockProduct
}

export const ProductInfo = ({ product }: ProductInfoProps) => {
  const isLowStock =
    product.stockQty <= product.lowStockThreshold && product.stockQty > 0

  const isOutOfStock = product.stockQty === 0

  return (
    <div className="space-y-6">
      {/* Category & SKU */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="gap-1.5">
          <Tag className="size-3" />
          {product.category.name}
        </Badge>
        {product.sku && (
          <Badge variant="outline" className="text-muted-foreground">
            SKU: {product.sku}
          </Badge>
        )}
      </div>

      {/* Product Name */}
      <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl text-balance">
        {product.name}
      </h1>

      {/* Seller Info */}
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-muted">
          {product.seller.avatarUrl ? (
            <img
              src={product.seller.avatarUrl || '/placeholder.svg'}
              alt={product.seller.displayName}
              width={40}
              height={40}
              className="object-cover"
            />
          ) : (
            <Store className="size-5 text-muted-foreground" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            {product.seller.displayName}
          </p>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'size-3.5',
                    i < Math.floor(product.seller.ratingAvg)
                      ? 'fill-primary text-primary'
                      : 'fill-muted text-muted',
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.seller.ratingAvg} ({product.seller.ratingCount}{' '}
              recenzija)
            </span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Pricing */}
      <div className="space-y-2">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold text-foreground">
            {formatPrice(product.price, product.currency)}
          </span>
          <span className="text-lg text-muted-foreground">
            / {unitLabels[product.unit]}
          </span>
        </div>
        {product.compareAtPrice && (
          <div className="flex items-center gap-2">
            <span className="text-lg text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice, product.currency)}
            </span>
            <Badge variant="destructive" className="text-xs">
              Ušteda{' '}
              {formatPrice(
                product.compareAtPrice - product.price,
                product.currency,
              )}
            </Badge>
          </div>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {isOutOfStock ? (
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="size-5" />
            <span className="font-medium">Nije na stanju</span>
          </div>
        ) : isLowStock ? (
          <div className="flex items-center gap-2 text-amber-500">
            <AlertCircle className="size-5" />
            <span className="font-medium">
              Poslednji komadi - ostalo samo {product.stockQty}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-green-500">
            <CheckCircle2 className="size-5" />
            <span className="font-medium">
              Na stanju ({product.stockQty} dostupno)
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons - Disabled for preview */}
      <div className="flex gap-3">
        <Button
          size="lg"
          className="flex-1 gap-2 cursor-not-allowed opacity-50"
          disabled
        >
          <Package className="size-5" />
          Dodaj u korpu
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="cursor-not-allowed opacity-50 bg-transparent"
          disabled
        >
          <Heart className="size-5" />
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="cursor-not-allowed opacity-50 bg-transparent"
          disabled
        >
          <Share2 className="size-5" />
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Dugmići su onemogućeni u pregledu
      </p>

      <Separator />

      {/* Features Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-border/50 bg-muted/30">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Truck className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Brza dostava</p>
              <p className="text-xs text-muted-foreground">2-4 radna dana</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-muted/30">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Sigurna kupovina</p>
              <p className="text-xs text-muted-foreground">
                Zaštićena transakcija
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-muted/30">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Package className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Besplatna dostava</p>
              <p className="text-xs text-muted-foreground">
                Za porudžbine preko 5000 RSD
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-muted/30">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Povrat u roku 14 dana</p>
              <p className="text-xs text-muted-foreground">Bez pitanja</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function formatPrice(cents: number, currency: string) {
  const amount = cents / 100
  const symbols: Record<string, string> = {
    RSD: 'RSD',
    EUR: '€',
    USD: '$',
  }
  if (currency === 'RSD') {
    return `${amount.toLocaleString('sr-RS')} ${symbols[currency]}`
  }
  return `${symbols[currency]}${amount.toLocaleString()}`
}

const unitLabels: Record<string, string> = {
  piece: 'kom',
  kg: 'kg',
  g: 'g',
  liter: 'L',
  box: 'kutija',
}
