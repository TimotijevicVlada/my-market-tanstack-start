import type { users } from '@/db/schema/users'

export interface GetUsersParams {
  page: number
  limit: number
  keyword?: string
}

export type User = Omit<typeof users.$inferSelect, 'passwordHash'>
