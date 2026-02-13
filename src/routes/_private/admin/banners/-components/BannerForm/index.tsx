import { Save } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { ImageSection } from './ImageSection'
import { ContentSection } from './ContentSection'
import { CtaSection } from './CtaSection'
import { PlacementSection } from './PlacementSection'
import type { BannerFormSchema } from './zod-schema'
import { Button } from '@/components/custom/Button'
import { ResetButton } from '@/components/custom/ResetButton'
import { BackLinkHead } from '@/components/custom/BackLinkHead'

interface BannerFormProps {
  type: 'create' | 'edit'
  onFormSubmit: (data: BannerFormSchema) => void
  isSubmitting: boolean
}

export const BannerForm = ({
  type,
  onFormSubmit,
  isSubmitting,
}: BannerFormProps) => {
  const { reset, handleSubmit } = useFormContext<BannerFormSchema>()

  return (
    <form
      className="space-y-6 mx-auto max-w-4xl"
      onSubmit={handleSubmit(onFormSubmit)}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <BackLinkHead
          path="/admin/banners"
          title={type === 'create' ? 'Kreiraj novi baner' : 'Izmeni baner'}
          description="Popunite informacije za promotivni baner"
        />
        <div className="flex items-center gap-3">
          <Button
            className="gap-1.5"
            loading={{
              state: isSubmitting,
              text: type === 'create' ? 'Čuvanje...' : 'Izmena...',
            }}
          >
            <Save className="size-3.5" />
            {type === 'create' ? 'Sačuvaj baner' : 'Sačuvaj izmene'}
          </Button>
        </div>
      </div>

      <ImageSection />
      <ContentSection />
      <CtaSection />
      <PlacementSection />

      <div className="flex justify-end gap-3">
        <ResetButton variant="outline" type="button" onClick={() => reset()} />
        <Button
          className="gap-1.5"
          type="submit"
          loading={{
            state: isSubmitting,
            text: type === 'create' ? 'Čuvanje...' : 'Izmena...',
          }}
        >
          <Save className="size-3.5" />
          {type === 'create' ? 'Sačuvaj baner' : 'Sačuvaj izmene'}
        </Button>
      </div>
    </form>
  )
}
