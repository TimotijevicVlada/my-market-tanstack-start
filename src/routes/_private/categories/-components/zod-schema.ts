import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().trim().min(1, 'Naziv kategorije je obavezan'),
  slug: z.string().trim().min(1, 'Slug kategorije je obavezan'),
  description: z.string().trim().nullish(),
  parentId: z.string().trim().nullish(),
})

export type CategorySchema = z.infer<typeof categorySchema>

export const defaultValues = {
  name: '',
  slug: '',
  description: '',
  parentId: null,
}
