import { Package } from 'lucide-react'
import { useState } from 'react'
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

export const BasicInfoSection = () => {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [sku, setSku] = useState('')

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[čć]/g, 'c')
      .replace(/[šś]/g, 's')
      .replace(/ž/g, 'z')
      .replace(/đ/g, 'dj')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleNameChange = (value: string) => {
    setName(value)
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(value))
    }
  }

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
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="npr. Pamučna majica Classic"
              className="bg-input/50 transition-colors focus:bg-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">
              URL slug <span className="text-destructive">*</span>
            </Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="pamucna-majica-classic"
              className="bg-input/50 font-mono text-sm transition-colors focus:bg-input"
            />
            <p className="text-xs text-muted-foreground">
              Automatski generisan iz naziva
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Opis proizvoda</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Opišite vaš proizvod detaljno..."
            className="min-h-[150px] bg-input/50 transition-colors focus:bg-input"
          />
          <p className="text-xs text-muted-foreground">
            Podržava formatiranje teksta (bold, italic, liste...)
          </p>
        </div>

        <div className="space-y-2 md:w-1/2">
          <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
          <Input
            id="sku"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
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
