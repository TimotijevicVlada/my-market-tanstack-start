import { z } from 'zod'

export const productFormSchema = z.object({
  // Status section
  status: z.enum(['draft', 'published', 'out_of_stock', 'archived']),

  // Basic info section
  name: z.string().min(1, 'Naziv je obavezan'),
  slug: z.string().min(1, 'Slug je obavezan'),
  description: z.string().nullish(),
  sku: z.string().nullish(),

  // Images section
  images: z.array(z.string()),

  // Price section
  price: z.number().min(0, 'Cena je obavezna'),
  compareAtPrice: z.number().nullish(),
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

  // Tags section
  tags: z.array(z.string()),

  // Attributes section
  attributes: z.record(z.string(), z.string()),

  // SEO section
  seoTitle: z.string().nullish(),
  seoDescription: z.string().nullish(),
})

export type ProductFormSchema = z.infer<typeof productFormSchema>

export const defaultValues: ProductFormSchema = {
  name: '',
  slug: '',
  description: '',
  price: 0,
  compareAtPrice: 0,
  currency: 'RSD',
  images: [],
  unit: 'piece',
  trackInventory: true,
  stockQty: 0,
  lowStockThreshold: 0,
  sku: '',
  tags: [],
  attributes: {},
  seoTitle: '',
  seoDescription: '',
  status: 'draft',
}
