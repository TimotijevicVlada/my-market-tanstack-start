import { z } from 'zod'

export const registerSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
    role: z.enum(['seller', 'buyer', 'admin', 'super-admin']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type RegisterFormData = z.infer<typeof registerSchema>
