import type { users } from '@/db/schema/users'

export type UserStatus = 'active' | 'inactive'
export type UserRole = 'seller' | 'buyer' | 'admin' | 'super-admin'

export type User = Omit<typeof users.$inferSelect, 'passwordHash'> & {
  productCount: number
}

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
