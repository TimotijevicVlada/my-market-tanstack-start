import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Neispravna email adresa'),
  password: z.string().min(1, 'Lozinka je obavezna'),
})

export type LoginFormData = z.infer<typeof loginSchema>
