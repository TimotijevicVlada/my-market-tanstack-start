import z from 'zod'

export const updateBasicInfoSchema = z.object({
  displayName: z.string().trim().min(1, 'Naziv prodavnice je obavezan'),
  description: z.string().trim().nullish(),
})

export type UpdateBasicInfoSchema = z.infer<typeof updateBasicInfoSchema>

export const updateBasicInfoDefaultValues: UpdateBasicInfoSchema = {
  displayName: '',
  description: null,
}
