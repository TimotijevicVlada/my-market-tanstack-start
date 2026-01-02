import z from 'zod'

export const thirdStepSchema = z.object({
  country: z
    .string()
    .trim()
    .nullable()
    .transform((val) => val || null),
  city: z
    .string()
    .trim()
    .nullable()
    .transform((val) => val || null),
  address: z
    .string()
    .trim()
    .nullable()
    .transform((val) => val || null),
  postalCode: z
    .string()
    .trim()
    .nullable()
    .transform((val) => val || null),
})

export type ThirdStepSchema = z.infer<typeof thirdStepSchema>

export const thirdStepDefaultValues = {
  country: null,
  city: null,
  address: null,
  postalCode: null,
}
