import { Eye, FileText, Save } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { StatusSection } from './StatusSection'
import { BasicInfoSection } from './BasicInfoSection'
import { ImagesSection } from './ImagesSection'
import { PriceSection } from './PriceSection'
import { InventorySection } from './InventorySection'
import { CategoriesSection } from './CategoriesSection'
import { TagsSection } from './TagsSection'
import { SeoSection } from './SeoSection'
import type { ProductFormSchema } from './zod-schema'
import { Button } from '@/components/custom/Button'

interface ProductFormProps {
  title: string
  onFormSubmit: (data: ProductFormSchema) => void
}

export const ProductForm = ({ title, onFormSubmit }: ProductFormProps) => {
  const { handleSubmit } = useFormContext<ProductFormSchema>()

  return (
    <form
      className="min-h-screen bg-background"
      onSubmit={handleSubmit(onFormSubmit)}
    >
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="mt-1 text-muted-foreground">
              Popunite informacije o vašem proizvodu
            </p>
          </div>
          <Button className="gap-2">
            <Save className="size-4" />
            Sačuvaj proizvod
          </Button>
        </div>

        <StatusSection />

        <BasicInfoSection />

        <ImagesSection />

        <PriceSection />

        <InventorySection />

        <CategoriesSection />

        <TagsSection />

        <SeoSection />

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
          <Button variant="outline" className="gap-2 bg-transparent">
            <FileText className="size-4" />
            Sačuvaj kao nacrt
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Eye className="size-4" />
              Pregled
            </Button>
            <Button className="gap-2">
              <Save className="size-4" />
              Sačuvaj i objavi
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
