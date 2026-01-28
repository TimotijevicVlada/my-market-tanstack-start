import { Globe } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
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
import { Textarea } from '@/components/ui/textarea'

export const SeoSection = () => {
  const { register, watch } = useFormContext<ProductFormSchema>()

  const seoTitle = watch('seoTitle')
  const seoDescription = watch('seoDescription')

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Globe className="size-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">SEO podešavanja</CardTitle>
            <CardDescription>
              Optimizujte proizvod za pretraživače
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="seoTitle">SEO naslov</Label>
            <span className="text-xs text-muted-foreground">
              {seoTitle?.length ?? 0}/70
            </span>
          </div>
          <Input
            id="seoTitle"
            {...register('seoTitle')}
            placeholder={'Naslov za pretraživače'}
            maxLength={70}
            className="bg-input/50 transition-colors focus:bg-input"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="seoDescription">SEO opis</Label>
            <span className="text-xs text-muted-foreground">
              {seoDescription?.length ?? 0}/160
            </span>
          </div>
          <Textarea
            id="seoDescription"
            {...register('seoDescription')}
            placeholder="Kratak opis koji će se prikazati u rezultatima pretrage..."
            maxLength={160}
            className="min-h-[80px] bg-input/50 transition-colors focus:bg-input"
          />
        </div>
      </CardContent>
    </Card>
  )
}
