import { DollarSign, Info } from 'lucide-react'
import { useController, useFormContext } from 'react-hook-form'
import type { ProductFormSchema } from '../zod-schema'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@/components/ui/alert'
import { NumberFormField } from '@/components/shadcn-studio/input/NumberTextField'

export const PriceSection = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<ProductFormSchema>()

  const { field: priceField } = useController({
    name: 'price',
    control,
  })

  const { field: compareAtPriceField } = useController({
    name: 'compareAtPrice',
    control,
  })

  const { field: currencyField } = useController({
    name: 'currency',
    control,
  })

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <DollarSign className="size-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Cena</CardTitle>
            <CardDescription>
              Postavite cenu i valutu za vaš proizvod
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <NumberFormField
            label="Cena"
            required
            error={errors.price?.message}
            value={priceField.value}
            onChange={priceField.onChange}
            minValue={0}
            placeholder="0.00"
          />

          <NumberFormField
            label="Prethodna cena"
            value={compareAtPriceField.value}
            onChange={compareAtPriceField.onChange}
            minValue={0}
            placeholder="0.00"
            description="Precrtana cena za prikaz popusta"
          />

          <div>
            <Label className="mb-2">Valuta</Label>
            <Select
              value={currencyField.value}
              onValueChange={currencyField.onChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((curr) => (
                  <SelectItem key={curr.value} value={curr.value}>
                    {curr.label} ({curr.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Discount preview */}
        {priceField.value && compareAtPriceField.value
          ? compareAtPriceField.value > priceField.value && (
              <Alert variant="success" appearance="light">
                <AlertIcon>
                  <Info className="size-5 text-green-500" />
                </AlertIcon>
                <div>
                  <AlertTitle>Popust aktivan</AlertTitle>
                  <AlertDescription>
                    <span className="text-muted-foreground">
                      {Math.round(
                        ((compareAtPriceField.value - priceField.value) /
                          compareAtPriceField.value) *
                          100,
                      )}
                      % niža cena od prethodne
                    </span>
                  </AlertDescription>
                </div>
              </Alert>
            )
          : null}
      </CardContent>
    </Card>
  )
}

const currencies: Array<{
  value: ProductFormSchema['currency']
  label: ProductFormSchema['currency']
  symbol: string
}> = [
  { value: 'RSD', label: 'RSD', symbol: 'дин.' },
  { value: 'EUR', label: 'EUR', symbol: '€' },
  { value: 'USD', label: 'USD', symbol: '$' },
]
