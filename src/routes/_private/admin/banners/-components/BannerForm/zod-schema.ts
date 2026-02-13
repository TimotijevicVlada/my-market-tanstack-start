import z from 'zod'

export const bannerFormSchema = z.object({
  imageUrl: z.string().min(1, 'Slika je obavezna'),
  title: z.string().min(1, 'Naslov je obavezan'),
  subtitle: z.string().nullish(),
  ctaLabel: z.string().min(1, 'Label je obavezan'),
  ctaHref: z.string().min(1, 'URL je obavezan'),
  placement: z.enum(['home', 'category']),
  isActive: z.boolean(),
})

export type BannerFormSchema = z.infer<typeof bannerFormSchema>

export const defaultValues: BannerFormSchema = {
  imageUrl: '',
  title: '',
  subtitle: '',
  ctaLabel: '',
  ctaHref: '',
  placement: 'home',
  isActive: true,
}
