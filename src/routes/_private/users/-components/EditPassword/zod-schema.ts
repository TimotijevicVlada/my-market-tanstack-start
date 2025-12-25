import z from 'zod'

export const editPasswordSchema = z.object({
  password: z
    .string()
    .min(1, 'Lozinka je obavezna')
    .min(4, 'Lozinka mora imati najmanje 4 karaktera'),
})

export type EditPasswordSchema = z.infer<typeof editPasswordSchema>

export const editPasswordDefaultValues: EditPasswordSchema = {
  password: '',
}
