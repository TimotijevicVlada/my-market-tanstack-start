import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { formUnitToDbUnit } from './types'
import type { CreateProductPayload } from './types'
import { db } from '@/db'
import { productImages } from '@/db/schema/product-images'
import { products } from '@/db/schema/products'
import { requireSellerMiddleware } from '@/lib/middleware'

export const createProduct = createServerFn({
  method: 'POST',
})
  .middleware([requireSellerMiddleware])
  .inputValidator((data: CreateProductPayload) => data)
  .handler(async ({ context, data }) => {
    const { user: sessionUser } = context

    const seller = await db.query.sellers.findFirst({
      where: (sellersTable) => eq(sellersTable.userId, sessionUser.id),
    })
    if (!seller) {
      throw new Error('Prodavac nije pronađen za ovog korisnika')
    }

    const { images: imageUrls, unit: formUnit, ...rest } = data

    const result = await db.transaction(async (tx) => {
      const [product] = await tx
        .insert(products)
        .values({
          ...rest,
          sellerId: seller.id,
          unit: formUnitToDbUnit[formUnit] ?? formUnit,
          stockQty: rest.stockQty ?? undefined,
          lowStockThreshold: rest.lowStockThreshold ?? undefined,
        })
        .returning()

      const [images] = await tx
        .insert(productImages)
        .values(
          imageUrls.map((imageUrl) => ({
            productId: product.id,
            url: imageUrl,
          })),
        )
        .returning()

      return {
        product,
        images,
      }
    })

    return result
  })
