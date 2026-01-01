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

  // Basic profile
  displayName: varchar('display_name', { length: 120 }).notNull(), // npr "Marko Petrović", "Etno gazdinstvo Jovanović"
  description: text('description'), // kratka priča, ko je, šta prodaje

  // Contact info
  phone: varchar('phone', { length: 30 }),
  email: varchar('email', { length: 255 }), // opcionalno (možeš i iz user-a)
  website: varchar('website', { length: 255 }),

  // Location (za filtre i pretragu)
  country: varchar('country', { length: 80 }).default('Serbia'),
  city: varchar('city', { length: 100 }),
  address: varchar('address', { length: 255 }),
  postalCode: varchar('postal_code', { length: 20 }),

  // Media
  avatarUrl: text('avatar_url'), // logo/slika prodavca
  coverImageUrl: text('cover_image_url'), // cover slika profila

  // Verification / trust
  status: sellerStatusEnum('status').notNull().default('pending'),
  verificationNote: text('verification_note'), // admin upiše razlog/napomenu

  // Business logic
  isActive: boolean('is_active').default(true).notNull(), // admin može da ga deaktivira
  commissionRate: numeric('commission_rate', {
    precision: 5,
    scale: 2,
  }).default('0.00'),
  // npr. 5.00 = 5% provizija (ako planiraš provizije)

  // Reputation (za pretragu i sortiranje)
  ratingAvg: numeric('rating_avg', { precision: 3, scale: 2 }).default('0.00'),
  ratingCount: integer('rating_count').default(0),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
