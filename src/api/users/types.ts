import type { users } from '@/db/schema/users'

export type UserStatus = 'active' | 'inactive'
export type UserRole = 'seller' | 'buyer' | 'admin' | 'super-admin'

export interface GetUsersParams {
  page: number
  limit: number
  keyword?: string
  status?: UserStatus | null
  role?: UserRole | null
}

export type User = Omit<typeof users.$inferSelect, 'passwordHash'>
