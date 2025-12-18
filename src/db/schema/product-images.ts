import { integer, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { products } from './products.ts'

export const productImages = pgTable('product_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  url: varchar('url', { length: 500 }).notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  altText: varchar('alt_text', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
})
