import { createFileRoute } from '@tanstack/react-router'
import { Eye, FileText, Save } from 'lucide-react'
import { StatusSection } from './-components/ProductForm/StatusSection'
import { BasicInfoSection } from './-components/ProductForm/BasicInfoSection'
import { PriceSection } from './-components/ProductForm/PriceSection'
import { ImagesSection } from './-components/ProductForm/ImagesSection'
import { InventorySection } from './-components/ProductForm/InventorySection'
import { CategoriesSection } from './-components/ProductForm/CategoriesSection'
import { TagsSection } from './-components/ProductForm/TagsSection'
import { SeoSection } from './-components/ProductForm/SeoSection'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_private/seller/products/create/')({
  component: () => {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Kreiranje proizvoda</h1>
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

          <PriceSection />

          <InventorySection />

          <CategoriesSection />

          <TagsSection />

          <ImagesSection />

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
      </div>
    )
  },
})
