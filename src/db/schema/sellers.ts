import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

import { users } from './users'

export const sellerStatusEnum = pgEnum('seller_status', [
  'pending',
  'approved',
  'rejected',
])

export const sellers = pgTable('sellers', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  displayName: varchar('display_name', { length: 120 }).notNull(),
  description: text('description'),

  phone: varchar('phone', { length: 30 }),
  email: varchar('email', { length: 255 }),
  website: varchar('website', { length: 255 }),

  country: varchar('country', { length: 80 }).default('Serbia'),
  city: varchar('city', { length: 100 }),
  address: varchar('address', { length: 255 }),
  postalCode: varchar('postal_code', { length: 20 }),

  avatarUrl: text('avatar_url'),
  coverImageUrl: text('cover_image_url'),

  status: sellerStatusEnum('status').notNull().default('pending'),
  verificationNote: text('verification_note'),

  isActive: boolean('is_active').notNull().default(true),
  commissionRate: numeric('commission_rate', {
    precision: 5,
    scale: 2,
  }).default('0.00'),

  ratingAvg: numeric('rating_avg', { precision: 3, scale: 2 }).default('0.00'),
  ratingCount: integer('rating_count').default(0),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .default(sql`NULL`)
    .$onUpdate(() => new Date()),
})
