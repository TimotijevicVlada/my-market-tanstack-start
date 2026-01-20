import type { user } from '@/db/schema/better-auth'

export type UserStatus = 'active' | 'inactive'
export type UserRole = 'seller' | 'buyer' | 'admin' | 'super-admin'

export type User = typeof user.$inferSelect

export type SortableUserColumns = keyof User

export type UserSort = {
  key: SortableUserColumns
  order: 'asc' | 'desc'
}

export interface GetUsersParams {
  page: number
  limit: number
  keyword?: string
  status?: UserStatus | null
  role?: UserRole | null
  sort: UserSort
}
