import type { sellers } from '@/db/schema/sellers'
import type { FourthStepSchema } from '@/components/shared/SellerForm/StepFour/zod-schema-step-four'
import type { FirstStepSchema } from '@/components/shared/SellerForm/StepOne/zod-schema-step-one'
import type { ThirdStepSchema } from '@/components/shared/SellerForm/StepThree/zod-schema-step-tree'
import type { SecondStepSchema } from '@/components/shared/SellerForm/StepTwo/zod-schema-step-two'

export type SellerStatus = 'active' | 'inactive'
export type VerificationStatus = 'pending' | 'approved' | 'rejected'

export interface SellerSort {
  key: SortableSellerColumns
  order: 'asc' | 'desc'
}
export interface GetSellerParams {
  page: number
  limit: number
  keyword?: string
  status?: SellerStatus | null
  verificationStatus?: VerificationStatus | null
  sort: SellerSort
}

export type Seller = typeof sellers.$inferSelect & {
  username: string | null
  categories: Array<{ id: string; name: string }>
}

export type MySeller = typeof sellers.$inferSelect

export type VerifySellerParams = {
  sellerId: string
  userId: string
  status: Seller['status']
  verificationNote?: string
}

export type CreateSellerPayload = FirstStepSchema &
  SecondStepSchema &
  ThirdStepSchema &
  FourthStepSchema

export interface UpdateSellerPayload extends CreateSellerPayload {
  sellerId: string
}

export interface UpdateMySellerPayload extends MySeller {
  sellerId: string
}

export type SortableSellerColumns = Exclude<keyof Seller, 'categories'>
