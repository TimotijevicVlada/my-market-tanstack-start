import { z } from 'zod'

export const userSchema = z.object({
  username: z.string().min(1, 'Korisničko ime je obavezno'),
  email: z.email('Neispravna email adresa'),
  password: z
    .string()
    .min(1, 'Lozinka je obavezna')
    .min(4, 'Lozinka mora imati najmanje 4 karaktera'),
  role: z.enum(['producer', 'buyer', 'admin']),
})

export type UserSchema = z.infer<typeof userSchema>

export const defaultValues: UserSchema = {
  username: '',
  email: '',
  password: '',
  role: 'buyer',
}
