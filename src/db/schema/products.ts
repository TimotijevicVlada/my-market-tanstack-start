import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { sellers } from './sellers'
import { categories } from './categories'

export const productStatusEnum = pgEnum('product_status', [
  'draft',
  'published',
  'archived',
])

export const currencyEnum = pgEnum('currency_code', ['RSD', 'EUR', 'USD'])

export const productUnitEnum = pgEnum('product_unit', [
  'piece', // default
  'kg',
  'g',
  'liter',
  'box',
])

// TipTap JSON doc (minimal type - dovoljno za start)

export type TiptapDoc = {
  type: 'doc'
  content?: Array<any>
}

export const products = pgTable(
  'products',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    sellerId: uuid('seller_id')
      .notNull()
      .references(() => sellers.id, { onDelete: 'cascade' }),

    // Core
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),

    // Rich text (TipTap JSON)
    description: jsonb('description')
      .$type<TiptapDoc>()
      .notNull()
      .default({ type: 'doc', content: [] }),

    // Pricing: integer (minor units)
    currency: currencyEnum('currency').notNull().default('RSD'),
    price: integer('price').notNull(),
    compareAtPrice: integer('compare_at_price'), // optional "precrtana cena"

    // Unit + inventory
    unit: productUnitEnum('unit').notNull().default('piece'),
    trackInventory: boolean('track_inventory').notNull().default(true),
    stockQty: integer('stock_qty').notNull().default(0),
    lowStockThreshold: integer('low_stock_threshold').notNull().default(0),

    // Optional: SKU (nije unique globalno, jer selleri mogu imati iste)
    sku: varchar('sku', { length: 64 }),

    // Category
    categoryId: uuid('category_id').references(() => categories.id, {
      onDelete: 'set null',
    }),

    // SEO (opciono ali korisno)
    seoTitle: varchar('seo_title', { length: 70 }),
    seoDescription: varchar('seo_description', { length: 160 }),

    // Lifecycle
    status: productStatusEnum('status').notNull().default('draft'),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    archivedAt: timestamp('archived_at', { withTimezone: true }),

    // Soft delete
    deletedAt: timestamp('deleted_at', { withTimezone: true }),

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex('products_seller_slug_uq').on(t.sellerId, t.slug),

    index('products_seller_status_idx').on(t.sellerId, t.status),

    index('products_status_idx').on(t.status),

    index('products_name_idx').on(t.name),

    index('products_published_at_idx').on(t.publishedAt),

    index('products_category_id_idx').on(t.categoryId),
  ],
)
