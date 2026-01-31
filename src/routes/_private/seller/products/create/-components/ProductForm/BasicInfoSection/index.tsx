import { Package } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { RichTextEditorDescription } from './Description'
import { Slug } from './Slug'
import type { ProductFormSchema } from '../zod-schema'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FormField } from '@/components/custom/FormField'

export const BasicInfoSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProductFormSchema>()

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Package className="size-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Osnovne informacije</CardTitle>
            <CardDescription>
              Naziv, opis i identifikacija proizvoda
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            label="Naziv proizvoda"
            placeholder="Unesite naziv proizvoda"
            required
            error={errors.name?.message}
            {...register('name')}
          />

          <Slug />
        </div>

        <RichTextEditorDescription />

        <div className="space-y-2 md:w-1/2">
          <FormField
            label="Šifra proizvoda (SKU)"
            error={errors.sku?.message}
            {...register('sku')}
            placeholder="npr. MAJ-001-BEL-L"
          />
          <p className="text-xs text-muted-foreground">
            Jedinstveni kod za internu evidenciju
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
