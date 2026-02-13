import { Eye, EyeOff, MapPin, Monitor, Tag } from 'lucide-react'
import { useController, useFormContext } from 'react-hook-form'
import type { BannerFormSchema } from '../zod-schema'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { SectionHead } from '@/components/custom/SectionHead'

export const PlacementSection = () => {
  const { control } = useFormContext<BannerFormSchema>()

  const placement = useController({ name: 'placement', control })
  const isActive = useController({ name: 'isActive', control })

  return (
    <Card>
      <CardHeader className="pb-4">
        <SectionHead
          Icon={MapPin}
          title="Podešavanja"
          description="Pozicija prikaza i vidljivost banera"
        />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>
              Pozicija prikaza <span className="text-destructive">*</span>
            </Label>
            <Select
              value={placement.field.value}
              onValueChange={(v) => placement.field.onChange(v)}
            >
              <SelectTrigger className="bg-input/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">
                  <span className="flex items-center gap-2">
                    <Monitor className="size-4" />
                    Pocetna strana
                  </span>
                </SelectItem>
                <SelectItem value="category">
                  <span className="flex items-center gap-2">
                    <Tag className="size-4" />
                    Stranica kategorije
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Izaberite gde ce se baner prikazivati
            </p>
          </div>
          <div className="space-y-2">
            <Label>Vidljivost</Label>
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-input/50 px-4 py-3">
              <div className="flex items-center gap-3">
                {isActive.field.value ? (
                  <Eye className="size-4 text-green-500" />
                ) : (
                  <EyeOff className="size-4 text-muted-foreground" />
                )}
                <div>
                  <p className="text-sm font-medium">
                    {isActive.field.value ? 'Aktivno' : 'Neaktivno'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isActive.field.value
                      ? 'Baner je vidljiv korisnicima'
                      : 'Baner je sakriven'}
                  </p>
                </div>
              </div>
              <Switch
                checked={isActive.field.value}
                onCheckedChange={isActive.field.onChange}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
