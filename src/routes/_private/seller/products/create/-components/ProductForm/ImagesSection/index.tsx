import { ImageIcon, Plus } from 'lucide-react'
import { useController, useFormContext } from 'react-hook-form'
import type { ProductFormSchema } from '../zod-schema'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/custom/Button'

export const ImagesSection = () => {
  const { control } = useFormContext<ProductFormSchema>()

  const {
    field: { value },
  } = useController({
    name: 'images',
    control,
  })

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
          <Button variant="outline" className="gap-2 bg-transparent">
            <Plus className="size-4" />
            Dodaj sliku
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {value.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {value.map((image) => (
              <div key={image}>
                <img src={image} alt="Product image" />
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
              type="button"
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
