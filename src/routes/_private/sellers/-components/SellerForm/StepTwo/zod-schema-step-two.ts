import z from 'zod'

export const secondStepSchema = z.object({
  email: z.email('Neispravna email adresa').trim().nullable(),
  phone: z.string().trim().nullable(),
  website: z.url('Neispravna URL adresa').trim().nullable(),
})

export type SecondStepSchema = z.infer<typeof secondStepSchema>

export const secondStepDefaultValues = {
  email: null,
  phone: null,
  website: null,
}
