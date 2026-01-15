import z from 'zod'

export const updateImagesSchema = z.object({
  avatarUrl: z.string().trim().nullish(),
  coverImageUrl: z.string().trim().nullish(),
})

export type UpdateImagesSchema = z.infer<typeof updateImagesSchema>

export const updateImagesDefaultValues = {
  avatarUrl: '',
  coverImageUrl: '',
}
