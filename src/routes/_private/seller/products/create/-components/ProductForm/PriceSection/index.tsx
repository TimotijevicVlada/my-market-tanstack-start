import { useState } from 'react'
import { DollarSign, Info } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const PriceSection = () => {
  const [price, setPrice] = useState('')
  const [compareAtPrice, setCompareAtPrice] = useState('')
  const [currency, setCurrency] = useState('RSD')

  const getCurrencySymbol = () => {
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
          <div className="space-y-2">
            <Label htmlFor="price">
              Cena <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="bg-input/50 pr-16 transition-colors focus:bg-input"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {getCurrencySymbol()}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="compareAtPrice">Prethodna cena</Label>
            <div className="relative">
              <Input
                id="compareAtPrice"
                type="number"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
                placeholder="0.00"
                className="bg-input/50 pr-16 transition-colors focus:bg-input"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {getCurrencySymbol()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Precrtana cena za prikaz popusta
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Valuta</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger id="currency" className="bg-input/50">
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
        {price && compareAtPrice && Number(compareAtPrice) > Number(price) && (
          <div className="flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
            <Info className="size-5 text-green-500" />
            <div className="text-sm">
              <span className="font-medium text-green-500">
                Popust aktivan:{' '}
              </span>
              <span className="text-muted-foreground">
                {Math.round(
                  ((Number(compareAtPrice) - Number(price)) /
                    Number(compareAtPrice)) *
                    100,
                )}
                % niža cena od prethodne
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const currencies = [
  { value: 'RSD', label: 'RSD', symbol: 'дин.' },
  { value: 'EUR', label: 'EUR', symbol: '€' },
  { value: 'USD', label: 'USD', symbol: '$' },
]
