import { useState } from 'react'
import { Warehouse } from 'lucide-react'
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
import { Switch } from '@/components/ui/switch'

export const InventorySection = () => {
  const [unit, setUnit] = useState('piece')
  const [trackInventory, setTrackInventory] = useState(true)
  const [stockQty, setStockQty] = useState('')
  const [lowStockThreshold, setLowStockThreshold] = useState('')

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Warehouse className="size-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Zalihe</CardTitle>
            <CardDescription>
              Upravljajte količinom i jedinicom mere
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4">
          <div className="space-y-1">
            <p className="font-medium">Praćenje zaliha</p>
            <p className="text-sm text-muted-foreground">
              Automatski pratite količinu proizvoda na stanju
            </p>
          </div>
          <Switch
            checked={trackInventory}
            onCheckedChange={setTrackInventory}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="unit">Jedinica mere</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger id="unit" className="bg-input/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {units.map((u) => (
                  <SelectItem key={u.value} value={u.value}>
                    {u.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {trackInventory && (
            <>
              <div className="space-y-2">
                <Label htmlFor="stockQty">Količina na stanju</Label>
                <Input
                  id="stockQty"
                  type="number"
                  value={stockQty}
                  onChange={(e) => setStockQty(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="bg-input/50 transition-colors focus:bg-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lowStock">Upozorenje za nisku zalihu</Label>
                <Input
                  id="lowStock"
                  type="number"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(e.target.value)}
                  placeholder="5"
                  min="0"
                  className="bg-input/50 transition-colors focus:bg-input"
                />
                <p className="text-xs text-muted-foreground">
                  Dobićete obaveštenje kada zaliha padne ispod ovog broja
                </p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const units = [
  { value: 'piece', label: 'Komad' },
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'g', label: 'Gram (g)' },
  { value: 'lb', label: 'Funta (lb)' },
  { value: 'oz', label: 'Unca (oz)' },
  { value: 'liter', label: 'Litar (L)' },
  { value: 'gallon', label: 'Galon' },
  { value: 'bunch', label: 'Svežanj' },
  { value: 'dozen', label: 'Tuce (12 kom)' },
  { value: 'box', label: 'Kutija' },
]
