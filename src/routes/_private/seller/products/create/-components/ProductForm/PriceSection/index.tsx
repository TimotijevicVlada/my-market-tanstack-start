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
import { FormField } from '@/components/custom/FormField'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@/components/ui/alert'

export const PriceSection = () => {
  const {
    register,
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

  const getCurrencySymbol = (currency: ProductFormSchema['currency']) => {
    return currencies.find((c) => c.value === currency)?.symbol || ''
  }

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
          <FormField
            required
            label="Cena"
            placeholder="0.00"
            error={errors.price?.message}
            type="number"
            {...register('price', { valueAsNumber: true })}
            endIcon={
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {getCurrencySymbol(currencyField.value)}
              </span>
            }
          />

          <div>
            <FormField
              label="Prethodna cena"
              placeholder="0.00"
              error={errors.compareAtPrice?.message}
              {...register('compareAtPrice', { valueAsNumber: true })}
              endIcon={
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {getCurrencySymbol(currencyField.value)}
                </span>
              }
            />
            <p className="text-xs text-muted-foreground">
              Precrtana cena za prikaz popusta
            </p>
          </div>

          <div className="">
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
