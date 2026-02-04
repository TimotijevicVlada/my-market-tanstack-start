import { useController, useFormContext } from 'react-hook-form'
import type { ProductFormSchema } from '../zod-schema'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const StatusSection = () => {
  const { control } = useFormContext<ProductFormSchema>()

  const { field } = useController({
    name: 'status',
    control,
  })

  return (
    <Card className="border-border/50">
      <CardContent className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Label htmlFor="status" className="text-muted-foreground">
            Status proizvoda:
          </Label>
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger id="status" className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <span
                      className={`size-2 rounded-full ${
                        option.value === 'published'
                          ? 'bg-green-500'
                          : option.value === 'draft'
                            ? 'bg-yellow-500'
                            : 'bg-muted-foreground'
                      }`}
                    />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground">
          {statusOptions.find((s) => s.value === status)?.description}
        </p>
      </CardContent>
    </Card>
  )
}

const statusOptions = [
  {
    value: 'draft',
    label: 'Nacrt',
    description: 'Proizvod nije vidljiv kupcima',
  },
  {
    value: 'published',
    label: 'Objavljen',
    description: 'Proizvod je aktivan i vidljiv',
  },
  {
    value: 'archived',
    label: 'Arhiviran',
    description: 'Proizvod je uklonjen iz ponude',
  },
]
