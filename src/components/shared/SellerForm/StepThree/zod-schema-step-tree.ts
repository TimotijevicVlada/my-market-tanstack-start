import z from 'zod'

export const thirdStepSchema = z.object({
  country: z.string().trim().nullable(),
  city: z.string().trim().nullable(),
  address: z.string().trim().nullable(),
  postalCode: z.string().trim().nullable(),
})

export type ThirdStepSchema = z.infer<typeof thirdStepSchema>

export const thirdStepDefaultValues = {
  country: null,
  city: null,
  address: null,
  postalCode: null,
}
