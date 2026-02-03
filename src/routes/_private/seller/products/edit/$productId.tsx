import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProductForm } from '../create/-components/ProductForm'
import {
  defaultValues,
  productFormSchema,
} from '../create/-components/ProductForm/zod-schema'
import type { ProductFormSchema } from '../create/-components/ProductForm/zod-schema'
import { dbUnitToFormUnit } from '@/api/products/types'
import { useGetProductById, useUpdateProduct } from '@/api/products/queries'

export const Route = createFileRoute(
  '/_private/seller/products/edit/$productId',
)({
  component: () => {
    const { productId } = Route.useParams()

    const methods = useForm<ProductFormSchema>({
      resolver: zodResolver(productFormSchema),
      defaultValues,
    })

    const { data: product } = useGetProductById(productId)

    const { mutate: updateProduct, isPending } = useUpdateProduct()

    const onFormSubmit = (data: ProductFormSchema) => {
      updateProduct({ data: { ...data, productId } })
    }

    useEffect(() => {
      if (product) {
        const p = product.product
        methods.reset({
          ...p,
          images: product.images.map((image) => image.url),
          compareAtPrice: p.compareAtPrice ?? undefined, // TODO: Adjust validation for compareAtPrice later
          unit: (dbUnitToFormUnit[p.unit] ?? // TODO: Reduce number of units later
            p.unit) as ProductFormSchema['unit'],
        })
      }
    }, [product])

    return (
      <FormProvider {...methods}>
        <ProductForm
          title="Uređivanje proizvoda"
          onFormSubmit={onFormSubmit}
          isSubmitting={isPending}
          type="edit"
        />
      </FormProvider>
    )
  },
})
