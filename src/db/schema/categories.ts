import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import type { PgColumn } from 'drizzle-orm/pg-core'

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  parentId: uuid('parent_id').references((): PgColumn => categories.id, {
    onDelete: 'cascade',
  }),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
