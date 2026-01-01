import type { sellers } from '@/db/schema'

export type SellerStatus = 'active' | 'inactive'

export interface GetSellerParams {
  page: number
  limit: number
  keyword?: string
  status?: SellerStatus
}

export type Seller = typeof sellers.$inferSelect

export type VerifySellerParams = {
  sellerId: string
  status: Seller['status']
  verificationNote?: string
}
