import type { users } from '@/db/schema/users'

export interface GetUsersParams {
  page: number
  limit: number
}

export type User = Omit<typeof users.$inferSelect, 'passwordHash'>
