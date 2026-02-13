import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const bannerPlacementEnum = pgEnum('banner_placement', [
  'home',
  'category',
])

export const banners = pgTable(
  'banners',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    placement: bannerPlacementEnum('placement').notNull().default('home'),

    title: varchar('title', { length: 120 }).notNull(),
    subtitle: varchar('subtitle', { length: 200 }),
    imageUrl: text('image_url').notNull(),
    altText: varchar('alt_text', { length: 140 }),

    ctaLabel: varchar('cta_label', { length: 40 }).notNull(),
    ctaHref: varchar('cta_href', { length: 255 }).notNull(),

    isActive: boolean('is_active').notNull().default(true),
    sortOrder: integer('sort_order').notNull().default(0),

    startAt: timestamp('start_at', { withTimezone: true }),
    endAt: timestamp('end_at', { withTimezone: true }),

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('banners_placement_active_order_idx').on(
      t.placement,
      t.isActive,
      t.sortOrder,
    ),

    index('banners_schedule_idx').on(t.startAt, t.endAt),
  ],
)
