import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BannerForm } from '../-components/BannerForm'
import {
  bannerFormSchema,
  defaultValues,
} from '../-components/BannerForm/zod-schema'
import type { BannerFormSchema } from '../-components/BannerForm/zod-schema'
import { useGetBannerById, useUpdateBanner } from '@/api/banners/queries'

export const Route = createFileRoute('/_private/admin/banners/edit/$bannerId')({
  component: BannerFormPage,
})

export function BannerFormPage() {
  const { bannerId } = Route.useParams()

  const { data: banner } = useGetBannerById(bannerId)

  const { mutate: updateBanner, isPending } = useUpdateBanner()

  const methods = useForm<BannerFormSchema>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues,
  })

  const onFormSubmit = (data: BannerFormSchema) => {
    updateBanner({ data: { ...data, bannerId } })
  }

  useEffect(() => {
    if (banner) {
      methods.reset(banner)
    }
  }, [banner])

  return (
    <FormProvider {...methods}>
      <BannerForm
        type="edit"
        onFormSubmit={onFormSubmit}
        isSubmitting={isPending}
      />
    </FormProvider>
  )
}
