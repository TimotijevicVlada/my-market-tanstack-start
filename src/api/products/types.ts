import type { ProductFormSchema } from '@/routes/_private/seller/products/create/-components/ProductForm/zod-schema'

export type CreateProductPayload = ProductFormSchema

export const formUnitToDbUnit: Record<
  string,
  | 'kg'
  | 'lb'
  | 'g'
  | 'oz'
  | 'piece'
  | 'bunch'
  | 'dozen'
  | 'liter'
  | 'gallon'
  | 'box'
> = {
  l: 'liter',
  pcs: 'piece',
  ml: 'liter',
  pack: 'piece',
  bag: 'box',
  jar: 'piece',
  tube: 'piece',
  bottle: 'piece',
  can: 'piece',
}

export const dbUnitToFormUnit: Record<string, string> = {
  liter: 'l',
  gallon: 'l',
  lb: 'kg',
  oz: 'g',
  bunch: 'piece',
  dozen: 'piece',
}
