import z from 'zod'

export const updateContactInfoSchema = z.object({
  email: z.email('Neispravna email adresa').trim().nullish(),
  phone: z.string().trim().nullish(),
  website: z.string().trim().nullish(),
})

export type UpdateContactInfoSchema = z.infer<typeof updateContactInfoSchema>

export const updateContactInfoDefaultValues = {
  email: '',
  phone: '',
  website: '',
}
