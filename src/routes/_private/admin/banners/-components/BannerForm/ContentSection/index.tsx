import { Type } from 'lucide-react'
import { useFormContext, useWatch } from 'react-hook-form'
import type { BannerFormSchema } from '../zod-schema'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/custom/Textarea'
import { SectionHead } from '@/components/custom/SectionHead'
import { FormField } from '@/components/custom/FormField'

export const ContentSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<BannerFormSchema>()

  const title = useWatch({ name: 'title' })
  const subtitle = useWatch({ name: 'subtitle' })

  return (
    <Card>
      <CardHeader className="pb-4">
        <SectionHead
          Icon={Type}
          title="Sadržaj"
          description="Naslov i podnaslov koji ce se prikazati na baneru"
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <FormField
            required
            label="Naslov"
            placeholder="npr. Velika zimska rasprodaja"
            maxLength={120}
            error={errors.title?.message}
            {...register('title')}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Glavni naslov koji privlaci paznju korisnika
            </p>
            <p
              className={`text-xs ${title.length > 100 ? 'text-primary' : 'text-muted-foreground'}`}
            >
              {title.length}/120
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="banner-subtitle">Podnaslov</Label>
          <Textarea
            {...register('subtitle')}
            placeholder="npr. Popusti do 50% na sve proizvode"
            maxLength={200}
            rows={3}
            className="resize-none bg-input/50 transition-colors focus:bg-input"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Kratak opis ili dodatna poruka
            </p>
            <p
              className={`text-xs ${subtitle.length > 170 ? 'text-primary' : 'text-muted-foreground'}`}
            >
              {subtitle.length}/200
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
