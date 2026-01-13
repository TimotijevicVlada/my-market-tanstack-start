import type { CreateSellerPayload } from './types'
import { sellers } from '@/db/schema/sellers'
import { db } from '@/db'
import { sellerCategories } from '@/db/schema/seller-categories'

export const createSellerFn = async (data: CreateSellerPayload) => {
  const { categories, ...sellerData } = data

  const [seller] = await db.insert(sellers).values(sellerData).returning()

  const [categoriesResult] = await db
    .insert(sellerCategories)
    .values(
      categories.map((categoryId) => ({
        sellerId: seller.id,
        categoryId,
      })),
    )
    .returning()

  return {
    seller,
    categories: categoriesResult,
  }
}
