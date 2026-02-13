import { MousePointerClick } from 'lucide-react'
import { useController, useFormContext } from 'react-hook-form'
import { BANNER_CTA_OPTIONS } from '../bannerCtaRoutes'
import type { BannerFormSchema } from '../zod-schema'
import type { FileRoutesByFullPath } from '@/routeTree.gen'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { SectionHead } from '@/components/custom/SectionHead'
import { Select } from '@/components/custom/Select'
import { FormField } from '@/components/custom/FormField'

export const CtaSection = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<BannerFormSchema>()

  const { field: ctaLabelField } = useController({ name: 'ctaLabel', control })
  const { field: ctaHrefField } = useController({ name: 'ctaHref', control })

  return (
    <Card>
      <CardHeader className="pb-4">
        <SectionHead
          Icon={MousePointerClick}
          title="Poziv na akciju (CTA)"
          description="Dugme koje usmerava korisnike ka odredjenoj stranici"
        />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <FormField
              required
              label="Tekst dugmeta"
              placeholder="npr. Kupuj sada"
              maxLength={40}
              error={errors.ctaLabel?.message}
              {...register('ctaLabel')}
              description={`${ctaLabelField.value.length}/40`}
            />
          </div>
          <div className="space-y-2">
            <Select
              required
              options={BANNER_CTA_OPTIONS}
              label="Link dugmeta"
              placeholder="Izaberite link dugmeta"
              value={ctaHrefField.value as keyof FileRoutesByFullPath | null}
              keys={{ label: 'name', value: 'id' }}
              onSelect={(option) => ctaHrefField.onChange(option?.id)}
              description="Stranice iz TanStack Router-a"
              error={errors.ctaHref?.message}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
