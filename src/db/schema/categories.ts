import { sql } from 'drizzle-orm'
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import type { PgColumn } from 'drizzle-orm/pg-core'

export const categoryIconEnum = pgEnum('category_icon', [
  'folder',
  'home-appliances',
  'tv-audio-and-video',
  'beauty-tools',
  'home-and-garden',
  'vehicle',
  'it-shop',
  'gaming',
  'sport-and-recreation',
  'phones',
  'childrens-equipement',
  'maintenance-and-cleaning',
  'beauty-and-care',
  'clothes',
  'fashion-accessories',
  'footwear',
  'pet-shop',
  'nutrition-and-health',
  'bookstore-and-entertainment',
  'food-and-drink',
  'toys-for-children',
  'office-and-school-supplies',
  'musical-instruments-and-equipment',
  'domestic-tradition-products',
  'other',
])

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  parentId: uuid('parent_id').references((): PgColumn => categories.id, {
    onDelete: 'cascade',
  }),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  description: text('description'),
  imageUrl: text('image_url'),
  featured: boolean('featured').notNull().default(false),
  icon: categoryIconEnum('icon').notNull().default('folder'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .default(sql`NULL`)
    .$onUpdate(() => new Date()),
})
