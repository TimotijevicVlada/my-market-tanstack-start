import type { users } from '@/db/schema/users'

export type UserStatus = 'active' | 'inactive'
export type UserRole = 'seller' | 'buyer' | 'admin' | 'super-admin'
export type UserSort = {
  key: keyof User
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

export type User = Omit<typeof users.$inferSelect, 'passwordHash'>

export type SortableUserColumns = Exclude<
  keyof User,
  'passwordHash' | 'productCount'
>
