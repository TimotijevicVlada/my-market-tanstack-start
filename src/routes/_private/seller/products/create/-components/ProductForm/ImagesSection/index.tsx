import { useState } from 'react'
import { GripVertical, ImageIcon, Plus, Star, Trash2 } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/custom/Button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

type ProductImage = {
  id: string
  url: string
  alt: string
  isPrimary: boolean
}

export const ImagesSection = () => {
  const [images, setImages] = useState<Array<ProductImage>>([])

  const addImage = () => {
    const newImage: ProductImage = {
      id: Math.random().toString(36).substr(2, 9),
      url: '',
      alt: '',
      isPrimary: images.length === 0,
    }
    setImages([...images, newImage])
  }

  const updateImage = (
    id: string,
    field: keyof ProductImage,
    value: string | boolean,
  ) => {
    setImages(
      images.map((img) => (img.id === id ? { ...img, [field]: value } : img)),
    )
  }

  const removeImage = (id: string) => {
    const updated = images.filter((img) => img.id !== id)
    if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
      updated[0].isPrimary = true
    }
    setImages(updated)
  }

  const setPrimaryImage = (id: string) => {
    setImages(
      images.map((img) => ({
        ...img,
        isPrimary: img.id === id,
      })),
    )
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <ImageIcon className="size-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Slike proizvoda</CardTitle>
              <CardDescription>
                Dodajte fotografije vašeg proizvoda
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={addImage}
            className="gap-2 bg-transparent"
          >
            <Plus className="size-4" />
            Dodaj sliku
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {images.length > 0 ? (
          <div className="space-y-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="flex flex-col gap-4 rounded-lg border border-border/50 bg-muted/30 p-4 sm:flex-row sm:items-start"
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="hidden size-5 cursor-grab text-muted-foreground sm:block" />
                  <div className="relative size-24 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                    {image.url ? (
                      <img
                        src={image.url || '/placeholder.svg'}
                        alt={image.alt || 'Product image'}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center">
                        <ImageIcon className="size-8 text-muted-foreground" />
                      </div>
                    )}
                    {image.isPrimary && (
                      <div className="absolute left-1 top-1">
                        <Badge className="gap-1 bg-primary px-1.5 py-0.5 text-xs">
                          <Star className="size-3" />
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      URL slike
                    </Label>
                    <Input
                      value={image.url}
                      onChange={(e) =>
                        updateImage(image.id, 'url', e.target.value)
                      }
                      placeholder="https://..."
                      className="bg-input/50 text-sm transition-colors focus:bg-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Alt tekst
                    </Label>
                    <Input
                      value={image.alt}
                      onChange={(e) =>
                        updateImage(image.id, 'alt', e.target.value)
                      }
                      placeholder="Opis slike za pristupačnost"
                      className="bg-input/50 text-sm transition-colors focus:bg-input"
                    />
                  </div>
                </div>

                <div className="flex gap-2 sm:flex-col">
                  {!image.isPrimary && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPrimaryImage(image.id)}
                      className="h-8 gap-1.5 text-xs"
                    >
                      <Star className="size-3" />
                      Primarna
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeImage(image.id)}
                    className="h-8 gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-3" />
                    Obriši
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border py-12 text-center">
            <ImageIcon className="mx-auto size-10 text-muted-foreground" />
            <p className="mt-3 font-medium">Nema dodatih slika</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Kliknite "Dodaj sliku" da dodate fotografije proizvoda
            </p>
            <Button
              variant="outline"
              onClick={addImage}
              className="mt-4 gap-2 bg-transparent"
            >
              <Plus className="size-4" />
              Dodaj prvu sliku
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
