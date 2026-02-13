import { Monitor, Plus, Tag } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { BannerPlacement } from '@/api/banners/types'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

interface BannerToolbarProps {
  filterPlacement: BannerPlacement
  setFilterPlacement: (placement: BannerPlacement) => void
}

export const BannerToolbar = ({
  filterPlacement,
  setFilterPlacement,
}: BannerToolbarProps) => {
  return (
    <Card className="mb-6 border-border/50 p-2">
      <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3">
          <Select
            value={filterPlacement}
            onValueChange={(v) => setFilterPlacement(v as BannerPlacement)}
          >
            <SelectTrigger className="w-[200px] bg-input/50">
              <SelectValue placeholder="Filtriraj po poziciji" />
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
        </div>
        <Button className="gap-1.5" asChild>
          <Link to="/admin/banners/create">
            <Plus className="size-4" />
            Kreiraj baner
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
