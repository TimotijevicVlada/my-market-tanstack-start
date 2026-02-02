import { createFileRoute } from '@tanstack/react-router'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProductForm } from './-components/ProductForm'
import {
  defaultValues,
  productFormSchema,
} from './-components/ProductForm/zod-schema'
import type { ProductFormSchema } from './-components/ProductForm/zod-schema'
import { useCreateProduct } from '@/api/products/queries'

export const Route = createFileRoute('/_private/seller/products/create/')({
  component: () => {
    const methods = useForm<ProductFormSchema>({
      resolver: zodResolver(productFormSchema),
      defaultValues,
    })

    const { mutate: createProduct, isPending } = useCreateProduct()

    const onFormSubmit = (data: ProductFormSchema) => {
      createProduct(
        { data },
        {
          onSuccess: () => {
            methods.reset()
          },
        },
      )
    }

    return (
      <FormProvider {...methods}>
        <ProductForm
          title="Kreiranje novog proizvoda"
          onFormSubmit={onFormSubmit}
          isSubmitting={isPending}
        />
      </FormProvider>
    )
  },
})
