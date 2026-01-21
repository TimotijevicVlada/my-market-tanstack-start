import { z } from 'zod'

export const registerSchema = z
  .object({
    username: z.string().min(3, 'Korisničko ime mora biti najmanje 3 karaktera'),
    email: z.string().email('Neispravna email adresa'),
    password: z.string().min(6, 'Lozinka mora biti najmanje 6 karaktera'),
    confirmPassword: z.string().min(6, 'Potvrdite lozinku'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Lozinke se ne podudaraju",
    path: ['confirmPassword'],
  })

export type RegisterFormData = z.infer<typeof registerSchema>

export const defaultValues = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
}
