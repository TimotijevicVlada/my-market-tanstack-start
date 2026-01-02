import z from 'zod'

export const secondStepSchema = z.object({
  email: z
    .email('Neispravna email adresa')
    .trim()
    .nullable()
    .transform((val) => val || null),
  phone: z
    .string()
    .trim()
    .nullable()
    .transform((val) => val || null),
  website: z
    .url('Neispravna URL adresa')
    .trim()
    .nullable()
    .transform((val) => val || null),
})

export type SecondStepSchema = z.infer<typeof secondStepSchema>

export const secondStepDefaultValues = {
  email: null,
  phone: null,
  website: null,
}
