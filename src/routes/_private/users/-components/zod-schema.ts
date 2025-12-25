import { z } from 'zod'

export const baseSchema = z.object({
  username: z.string().min(1, 'Korisničko ime je obavezno'),
  email: z.email('Neispravna email adresa'),
  role: z.enum(['producer', 'buyer', 'admin']),
})

export const createUserSchema = baseSchema.extend({
  password: z
    .string()
    .min(1, 'Lozinka je obavezna')
    .min(4, 'Lozinka mora imati najmanje 4 karaktera'),
})

export type EditUserSchema = z.infer<typeof baseSchema>
export type CreateUserSchema = z.infer<typeof createUserSchema>

export const createUserDefaultValues: CreateUserSchema = {
  username: '',
  email: '',
  password: '',
  role: 'buyer',
}

export const editUserDefaultValues: EditUserSchema = {
  username: '',
  email: '',
  role: 'buyer',
}
