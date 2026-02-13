import { createFileRoute } from '@tanstack/react-router'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BannerForm } from '../-components/BannerForm'
import {
  bannerFormSchema,
  defaultValues,
} from '../-components/BannerForm/zod-schema'
import type { BannerFormSchema } from '../-components/BannerForm/zod-schema'
import { useCreateBanner } from '@/api/banners/queries'

export const Route = createFileRoute('/_private/admin/banners/create/')({
  component: BannerFormPage,
})

export function BannerFormPage() {
  const { mutate: createBanner, isPending } = useCreateBanner()

  const methods = useForm<BannerFormSchema>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues,
  })

  const onFormSubmit = (data: BannerFormSchema) => {
    createBanner(
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
      <BannerForm
        type="create"
        onFormSubmit={onFormSubmit}
        isSubmitting={isPending}
      />
    </FormProvider>
  )
}
