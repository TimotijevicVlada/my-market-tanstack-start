import z from 'zod'

export const updateLocationInfoSchema = z.object({
  country: z.string().trim().nullish(),
  city: z.string().trim().nullish(),
  address: z.string().trim().nullish(),
  postalCode: z.string().trim().nullish(),
})

export type UpdateLocationInfoSchema = z.infer<typeof updateLocationInfoSchema>

export const updateLocationInfoDefaultValues = {
  country: '',
  city: '',
  address: '',
  postalCode: '',
}
