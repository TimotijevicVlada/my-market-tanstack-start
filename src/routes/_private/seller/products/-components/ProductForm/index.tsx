import { Save } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { StatusSection } from './StatusSection'
import { BasicInfoSection } from './BasicInfoSection'
import { ImagesSection } from './ImagesSection'
import { PriceSection } from './PriceSection'
import { InventorySection } from './InventorySection'
import { SeoSection } from './SeoSection'
import type { ProductFormSchema } from './zod-schema'
import { Button } from '@/components/custom/Button'
import { ResetButton } from '@/components/custom/ResetButton'
import { BackLinkHead } from '@/components/custom/BackLinkHead'

interface ProductFormProps {
  title: string
  onFormSubmit: (data: ProductFormSchema) => void
  isSubmitting: boolean
  type: 'create' | 'edit'
}

export const ProductForm = ({
  title,
  onFormSubmit,
  isSubmitting,
  type,
}: ProductFormProps) => {
  const { handleSubmit, reset } = useFormContext<ProductFormSchema>()

  return (
    <form
      className="min-h-screen bg-background"
      onSubmit={handleSubmit(onFormSubmit)}
    >
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <BackLinkHead
            path="/seller/products"
            title={title}
            description="Popunite informacije o vašem proizvodu"
          />
          <Button
            loading={{
              state: isSubmitting,
              text: 'Čuvanje...',
            }}
            type="submit"
          >
            <Save className="size-4" />
            {type === 'create' ? 'Sačuvaj proizvod' : 'Sačuvaj izmene'}
          </Button>
        </div>

        <StatusSection />
        <BasicInfoSection />
        <PriceSection />
        <ImagesSection />
        <InventorySection />
        <SeoSection />

        <div className="flex justify-end">
          <div className="flex gap-3">
            <ResetButton
              variant="outline"
              type="button"
              onClick={() => reset()}
            />
            <Button
              className="gap-2"
              type="submit"
              loading={{
                state: isSubmitting,
                text: 'Čuvanje...',
              }}
            >
              <Save className="size-4" />
              {type === 'create' ? 'Sačuvaj proizvod' : 'Sačuvaj izmene'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
