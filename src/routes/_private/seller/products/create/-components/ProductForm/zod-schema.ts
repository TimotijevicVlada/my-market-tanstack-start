import { z } from 'zod'

export const productFormSchema = z.object({
  // Status section
  status: z.enum(['draft', 'published', 'out_of_stock', 'archived']),

  // Basic info section
  name: z.string().min(1, 'Naziv je obavezan'),
  slug: z.string().min(1, 'Slug je obavezan'),
  description: z.string().nullish(),
  sku: z.string().nullish(),
  categoryId: z.string().nullish(),

  // Images section
  images: z.array(z.string()),

  // Price section
  price: z
    .number({ message: 'Cena mora biti veća od 0' })
    .gt(0, 'Cena mora biti veća od 0'),
  compareAtPrice: z.number().optional().catch(undefined),
  currency: z.enum(['RSD', 'EUR', 'USD']),

  // Inventory section
  unit: z.enum([
    'piece',
    'kg',
    'g',
    'l',
    'ml',
    'pcs',
    'box',
    'bag',
    'jar',
    'tube',
    'bottle',
    'can',
    'pack',
    'box',
    'bag',
    'jar',
    'tube',
    'bottle',
    'can',
    'pack',
  ]),
  trackInventory: z.boolean(),
  stockQty: z.number().nullish(),
  lowStockThreshold: z.number().nullish(),

  // SEO section
  seoTitle: z.string().nullish(),
  seoDescription: z.string().nullish(),
})

export type ProductFormSchema = z.infer<typeof productFormSchema>

export const defaultValues: Partial<ProductFormSchema> = {
  name: '',
  slug: '',
  description: '',
  sku: '',
  categoryId: null,
  price: undefined,
  compareAtPrice: undefined,
  currency: 'RSD',
  images: [],
  unit: 'piece',
  trackInventory: true,
  stockQty: 0,
  lowStockThreshold: 0,
  seoTitle: '',
  seoDescription: '',
  status: 'draft',
}
