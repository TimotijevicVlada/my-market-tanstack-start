import z from 'zod'

export const fourthStepSchema = z.object({
  avatarUrl: z.string().nullish(),
  coverImageUrl: z.string().nullish(),
})

export type FourthStepSchema = z.infer<typeof fourthStepSchema>

export const fourthStepDefaultValues = {
  avatarUrl: null,
  coverImageUrl: null,
}
