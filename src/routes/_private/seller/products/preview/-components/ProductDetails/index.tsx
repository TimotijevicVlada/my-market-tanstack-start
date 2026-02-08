import { Route } from '../../$productId'
import { statusBadgeConfig } from '../Images/data'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

const unitLabels: Record<string, string> = {
  piece: 'kom',
  kg: 'kg',
  g: 'g',
  liter: 'L',
  box: 'kutija',
}

export const ProductDetails = () => {
  const product = Route.useLoaderData()

  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Detalji proizvoda
        </h3>
        <dl className="space-y-3">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">SKU</dt>
            <dd className="font-medium">{product.sku ?? '-'}</dd>
          </div>
          <Separator />
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Kategorija</dt>
            <dd className="font-medium">{product.categoryName}</dd>
          </div>
          <Separator />
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Jedinica mere</dt>
            <dd className="font-medium">{unitLabels[product.unit]}</dd>
          </div>
          <Separator />
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Status</dt>
            <dd>
              <Badge variant="default">
                {statusBadgeConfig[product.status].label}
              </Badge>
            </dd>
          </div>
          <Separator />
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Objavljeno</dt>
            <dd className="font-medium">
              {product.createdAt.toLocaleDateString('sr-RS', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
