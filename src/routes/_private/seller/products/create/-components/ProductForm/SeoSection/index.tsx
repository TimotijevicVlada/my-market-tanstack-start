import { useState } from 'react'
import { Globe } from 'lucide-react'
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
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')

  const [name] = useState('')
  const [slug] = useState('')
  const [description] = useState('')

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
              {seoTitle.length}/70
            </span>
          </div>
          <Input
            id="seoTitle"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder={name || 'Naslov za pretraživače'}
            maxLength={70}
            className="bg-input/50 transition-colors focus:bg-input"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="seoDescription">SEO opis</Label>
            <span className="text-xs text-muted-foreground">
              {seoDescription.length}/160
            </span>
          </div>
          <Textarea
            id="seoDescription"
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            placeholder="Kratak opis koji će se prikazati u rezultatima pretrage..."
            maxLength={160}
            className="min-h-[80px] bg-input/50 transition-colors focus:bg-input"
          />
        </div>

        {/* SEO Preview */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">
            Pregled u pretraživaču
          </Label>
          <div className="rounded-lg border border-border bg-white p-4">
            <p className="text-lg text-[#1a0dab] hover:underline">
              {seoTitle || name || 'Naziv proizvoda'}
            </p>
            <p className="mt-1 text-sm text-[#006621]">
              vasaprodavnica.rs › proizvodi › {slug || 'naziv-proizvoda'}
            </p>
            <p className="mt-1 text-sm text-[#545454]">
              {seoDescription ||
                description.substring(0, 160) ||
                'Opis vašeg proizvoda će se prikazati ovde...'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
