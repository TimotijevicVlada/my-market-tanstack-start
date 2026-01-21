import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { categories } from './schema/categories.ts'
import { sellers } from './schema/sellers.ts'
import { products } from './schema/products.ts'
import { productReviews } from './schema/product-reviews.ts'
import { productImages } from './schema/product-images.ts'
import { sellerCategories } from './schema/seller-categories.ts'
import { account, session, user, verification, } from './schema/better-auth.ts'

config()

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
})
export const db = drizzle(pool, {
  schema: {
    categories,
    sellers,
    products,
    productReviews,
    productImages,
    sellerCategories,

    // Better Auth tables
    user,
    session,
    account,
    verification,
  },
})
