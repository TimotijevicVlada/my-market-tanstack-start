import { z } from 'zod'

export const baseSchema = z.object({
  status: z.string().min(1, 'Status je obavezan'),
})

export const rejectedSchema = baseSchema.extend({
  verificationNote: z.string().min(1, 'Poruka je obavezna'),
})

export type BaseSchema = z.infer<typeof baseSchema>
export type RejectedSchema = z.infer<typeof rejectedSchema>
export type VerifySellerSchema = BaseSchema & RejectedSchema

export const verifySellerDefaultValues = {
  status: '',
  verificationNote: '',
}
