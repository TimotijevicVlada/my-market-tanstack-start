import { Link2, MousePointerClick } from 'lucide-react'
import { useFormContext, useWatch } from 'react-hook-form'
import type { BannerFormSchema } from '../zod-schema'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { SectionHead } from '@/components/custom/SectionHead'

export const CtaSection = () => {
  const { register } = useFormContext<BannerFormSchema>()

  const ctaLabel = useWatch({ name: 'ctaLabel' })

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
            <Label htmlFor="banner-cta-label">
              Tekst dugmeta <span className="text-destructive">*</span>
            </Label>
            <Input
              {...register('ctaLabel')}
              placeholder="npr. Kupuj sada"
              maxLength={40}
              className="bg-input/50 transition-colors focus:bg-input"
            />
            <p
              className={`text-right text-xs ${ctaLabel.length > 30 ? 'text-primary' : 'text-muted-foreground'}`}
            >
              {ctaLabel.length}/40
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="banner-cta-href">
              Link dugmeta <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                {...register('ctaHref')}
                placeholder="/rasprodaja"
                maxLength={255}
                className="bg-input/50 pl-10 transition-colors focus:bg-input"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Relativni ili apsolutni URL
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
