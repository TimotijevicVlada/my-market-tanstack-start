import type { sellers } from '@/db/schema'
import type { FirstStepSchema } from '@/routes/_private/sellers/-components/SellerForm/StepOne/zod-schema-step-one'
import type { ThirdStepSchema } from '@/routes/_private/sellers/-components/SellerForm/StepThree/zod-schema-step-tree'
import type { SecondStepSchema } from '@/routes/_private/sellers/-components/SellerForm/StepTwo/zod-schema-step-two'

export type SellerStatus = 'active' | 'inactive'

export interface GetSellerParams {
  page: number
  limit: number
  keyword?: string
  status?: SellerStatus
}

export type Seller = typeof sellers.$inferSelect & {
  categories: Array<{ id: string; name: string }>
}

export type VerifySellerParams = {
  sellerId: string
  status: Seller['status']
  verificationNote?: string
}

export type CreateSellerPayload = FirstStepSchema &
  SecondStepSchema &
  ThirdStepSchema

export interface UpdateSellerPayload extends CreateSellerPayload {
  sellerId: string
}
