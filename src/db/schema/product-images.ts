import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { products } from './products.ts'

export const productImages = pgTable(
  'product_images',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),

    url: text('url').notNull(),
    alt: varchar('alt', { length: 140 }),

    sortOrder: integer('sort_order').notNull().default(0),
    isPrimary: boolean('is_primary').notNull().default(false),

    // optional: blurhash, width/height, provider metadata...
    meta: jsonb('meta').$type<Record<string, object>>().notNull().default({}),

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('product_images_product_idx').on(t.productId),
    index('product_images_primary_idx').on(t.productId, t.isPrimary),
  ],
)
