import z from 'zod'

export const updateAvatarSchema = z.object({
  avatarUrl: z.string().trim().nullish(),
})

export type UpdateAvatarSchema = z.infer<typeof updateAvatarSchema>

export const updateAvatarDefaultValues = {
  avatarUrl: '',
}
