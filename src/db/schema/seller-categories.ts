import { pgTable, primaryKey, timestamp, uuid } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { sellers } from './sellers'
import { categories } from './categories'

export const sellerCategories = pgTable(
  'seller_categories',
  {
    sellerId: uuid('seller_id')
      .notNull()
      .references(() => sellers.id, { onDelete: 'cascade' }),

    categoryId: uuid('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at')
      .default(sql`NULL`)
      .$onUpdate(() => new Date()),
  },
  (table) => [
    primaryKey({
      name: 'seller_categories_pkey',
      columns: [table.sellerId, table.categoryId],
    }),
  ],
)
