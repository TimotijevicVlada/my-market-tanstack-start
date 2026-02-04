import { createServerFn } from '@tanstack/react-start'
import {
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  or,
} from 'drizzle-orm'
import { formUnitToDbUnit } from './types'
import type {
  CreateProductPayload,
  GetProductsParams,
  UpdateProductPayload,
} from './types'
import { db } from '@/db'
import { productImages } from '@/db/schema/product-images'
import { products } from '@/db/schema/products'
import { authMiddleware, requireSellerMiddleware } from '@/lib/middleware'
import { categories } from '@/db/schema/categories'

export const getPagedProducts = createServerFn({
  method: 'POST',
})
  .middleware([requireSellerMiddleware])
  .inputValidator((data: GetProductsParams) => data)
  .handler(async ({ context, data }) => {
    const { user: sessionUser } = context
    const seller = await db.query.sellers.findFirst({
      where: (sellersTable) => eq(sellersTable.userId, sessionUser.id),
    })
    if (!seller) {
      throw new Error('Prodavac nije pronađen za ovog korisnika')
    }

    const { page, limit, keyword, status, sort } = data
    const trimmedKeyword = keyword?.trim()
    const hasKeyword = trimmedKeyword !== ''

    const offset = (page - 1) * limit

    const conditions = [eq(products.sellerId, seller.id)]
    if (hasKeyword) {
      conditions.push(
        or(
          ilike(products.name, `%${trimmedKeyword}%`),
          ilike(products.slug, `%${trimmedKeyword}%`),
        )!,
      )
    }
    if (status) {
      conditions.push(eq(products.status, status))
    }

    const totalQuery = db
      .select({ count: count() })
      .from(products)
      .where(and(...conditions))

    const [totalResult] = await totalQuery
    const total = totalResult.count

    const orderByColumn = products[sort.key]

    const result = await db
      .select({
        ...getTableColumns(products),
        categoryName: categories.name,
        primaryImageUrl: productImages.url,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(
        productImages,
        and(
          eq(productImages.productId, products.id),
          eq(productImages.isPrimary, true),
        ),
      )
      .where(and(...conditions))
      .orderBy(
        sort.order === 'asc' ? asc(orderByColumn) : desc(orderByColumn),
        desc(products.id),
      )
      .limit(limit)
      .offset(offset)

    return {
      data: result,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  })

export const getProductById = createServerFn({
  method: 'GET',
})
  .middleware([authMiddleware])
  .inputValidator((data: { productId: string }) => data)
  .handler(async ({ data }) => {
    const { productId } = data

    const product = await db.query.products.findFirst({
      where: (productsTable) => eq(productsTable.id, productId),
    })

    if (!product) {
      throw new Error('Proizvod nije pronađen')
    }

    const images = await db.query.productImages.findMany({
      where: (productImagesTable) =>
        eq(productImagesTable.productId, product.id),
      orderBy: (productImagesTable) => [asc(productImagesTable.sortOrder)],
    })

    return {
      product,
      images,
    }
  })

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
          imageUrls.map((imageUrl, index) => ({
            productId: product.id,
            url: imageUrl,
            alt: `${product.name} - ${index + 1}`,
            sortOrder: index + 1,
            isPrimary: index === 0,
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

export const updateProduct = createServerFn({
  method: 'POST',
})
  .middleware([requireSellerMiddleware])
  .inputValidator((data: UpdateProductPayload) => data)
  .handler(async ({ data }) => {
    const { productId } = data

    const product = await db.query.products.findFirst({
      where: (productsTable) => eq(productsTable.id, productId),
    })
    if (!product) {
      throw new Error('Proizvod nije pronađen')
    }

    const { images: imageUrls, unit: formUnit, ...rest } = data

    const result = await db.transaction(async (tx) => {
      const [updatedProduct] = await tx
        .update(products)
        .set({
          ...rest,
          unit: formUnitToDbUnit[formUnit] ?? formUnit,
          stockQty: rest.stockQty ?? undefined,
          lowStockThreshold: rest.lowStockThreshold ?? undefined,
        })
        .where(eq(products.id, productId))
        .returning()

      await tx
        .delete(productImages)
        .where(eq(productImages.productId, productId))

      const [newImages] = await tx
        .insert(productImages)
        .values(
          imageUrls.map((imageUrl, index) => ({
            productId: product.id,
            url: imageUrl,
            alt: `${product.name} - ${index + 1}`,
            sortOrder: index + 1,
            isPrimary: index === 0,
          })),
        )
        .returning()

      return {
        product: updatedProduct,
        images: newImages,
      }
    })

    return result
  })
