import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { users } from './schema/users.ts'
import { categories } from './schema/categories.ts'
import { producers } from './schema/producers.ts'
import { products } from './schema/products.ts'
import { productReviews } from './schema/product-reviews.ts'
import { productImages } from './schema/product-images.ts'

config()

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
})
export const db = drizzle(pool, {
  schema: {
    users,
    categories,
    producers,
    products,
    productReviews,
    productImages,
  },
})
