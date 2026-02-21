import { useController, useFormContext } from 'react-hook-form'
import { iconOptions } from './data'
import type { CategorySchema } from '../../zod-schema'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const IconSelect = () => {
  const { control } = useFormContext<CategorySchema>()

  const { field } = useController({
    name: 'icon',
    control,
  })

  return (
    <div className="space-y-2">
      <Label htmlFor="icon">
        Ikona kategorije <span className="text-destructive font-bold">*</span>
      </Label>
      <Select value={field.value} onValueChange={field.onChange}>
        <SelectTrigger id="icon" className="w-full">
          <SelectValue placeholder="Izaberite ikonu" />
        </SelectTrigger>
        <SelectContent>
          {iconOptions.map((option) => {
            const Icon = option.icon
            return (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <Icon className="size-4 shrink-0" />
                  {option.label}
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}
