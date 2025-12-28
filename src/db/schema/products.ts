import {
  boolean,
  decimal,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { sellers } from './sellers.ts'
import { categories } from './categories.ts'

export const productUnitEnum = pgEnum('product_unit', [
  'kg',
  'lb',
  'g',
  'oz',
  'piece',
  'bunch',
  'dozen',
  'liter',
  'gallon',
  'box',
])

export const productStatusEnum = pgEnum('product_status', [
  'draft',
  'published',
  'out_of_stock',
  'archived',
])

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  sellerId: uuid('seller_id')
    .notNull()
    .references(() => sellers.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'restrict' }),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  unit: productUnitEnum('unit').notNull(),
  quantity: integer('quantity').notNull().default(0),
  isAvailable: boolean('is_available').notNull().default(true),
  isOrganic: boolean('is_organic').notNull().default(false),
  originPlace: varchar('origin_place', { length: 255 }).notNull(),
  mainImageUrl: varchar('main_image_url', { length: 500 }),
  status: productStatusEnum('status').notNull().default('draft'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
