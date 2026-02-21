import { z } from 'zod'
import { categoryIconEnum } from '@/db/schema/categories'

export const categorySchema = z.object({
  name: z.string().trim().min(1, 'Naziv kategorije je obavezan'),
  slug: z.string().trim().min(1, 'Slug kategorije je obavezan'),
  description: z.string().trim().nullish(),
  parentId: z.string().nullish(),
  featured: z.boolean(),
  icon: z.enum(categoryIconEnum.enumValues),
})

export type CategorySchema = z.infer<typeof categorySchema>

export const defaultValues: z.infer<typeof categorySchema> = {
  name: '',
  slug: '',
  description: '',
  parentId: null,
  featured: false,
  icon: 'folder',
}
