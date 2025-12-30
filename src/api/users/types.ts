import type { users } from '@/db/schema/users'

export type UserStatus = 'active' | 'inactive'

export interface GetUsersParams {
  page: number
  limit: number
  keyword?: string
  status?: UserStatus
}

export type User = Omit<typeof users.$inferSelect, 'passwordHash'>
