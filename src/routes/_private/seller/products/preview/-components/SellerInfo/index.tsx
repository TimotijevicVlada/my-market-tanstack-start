import { Star, Store } from 'lucide-react'
import type { mockProduct } from '../../$productId'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/custom/Button'
import { cn } from '@/lib/utils'

interface SellerInfoProps {
  product: typeof mockProduct
}
export const SellerInfo = ({ product }: SellerInfoProps) => {
  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          O prodavcu
        </h3>
        <div className="flex items-start gap-4">
          <div className="flex size-16 items-center justify-center overflow-hidden rounded-xl bg-muted">
            {product.seller.avatarUrl ? (
              <img
                src={product.seller.avatarUrl || '/placeholder.svg'}
                alt={product.seller.displayName}
                width={64}
                height={64}
                className="object-cover"
              />
            ) : (
              <Store className="size-8 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground">
              {product.seller.displayName}
            </h4>
            <div className="mt-1 flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'size-4',
                      i < Math.floor(product.seller.ratingAvg)
                        ? 'fill-primary text-primary'
                        : 'fill-muted text-muted',
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.seller.ratingAvg}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {product.seller.ratingCount} recenzija
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="mt-4 w-full gap-2 bg-transparent"
          disabled
        >
          <Store className="size-4" />
          Poseti prodavnicu
        </Button>
      </CardContent>
    </Card>
  )
}
