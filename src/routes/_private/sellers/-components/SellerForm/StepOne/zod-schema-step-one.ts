import z from 'zod'

export const firstStepSchema = z.object({
  userId: z.string().min(1, 'Korisnik je obavezan'),
  displayName: z.string().trim().min(1, 'Naziv prodavca je obavezan'),
  categories: z
    .array(z.string())
    .min(1, 'Minimum jedna kategorija je obavezna'),
  description: z.string().trim().nullish(),
})

export type FirstStepSchema = z.infer<typeof firstStepSchema>

export const firstStepDefaultValues = {
  userId: '',
  displayName: '',
  categories: [],
  description: null,
}
