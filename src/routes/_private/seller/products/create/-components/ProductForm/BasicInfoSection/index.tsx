import { Package } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { RichTextEditorDescription } from './Description'
import type { ProductFormSchema } from '../zod-schema'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const BasicInfoSection = () => {
  const { register } = useFormContext<ProductFormSchema>()

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
          <div className="space-y-2">
            <Label htmlFor="name">
              Naziv proizvoda <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="npr. Pamučna majica Classic"
              className="bg-input/50 transition-colors focus:bg-input"
              {...register('name')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">
              URL slug <span className="text-destructive">*</span>
            </Label>
            <Input
              id="slug"
              {...register('slug')}
              placeholder="pamucna-majica-classic"
              className="bg-input/50 font-mono text-sm transition-colors focus:bg-input"
            />
            <p className="text-xs text-muted-foreground">
              Automatski generisan iz naziva
            </p>
          </div>
        </div>

        <RichTextEditorDescription />

        <div className="space-y-2 md:w-1/2">
          <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
          <Input
            id="sku"
            {...register('sku')}
            placeholder="npr. MAJ-001-BEL-L"
            className="bg-input/50 font-mono transition-colors focus:bg-input"
          />
          <p className="text-xs text-muted-foreground">
            Jedinstveni kod za internu evidenciju
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
