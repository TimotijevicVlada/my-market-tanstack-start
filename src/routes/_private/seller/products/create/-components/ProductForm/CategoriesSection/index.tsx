import { useState } from 'react'
import { GripVertical, Plus, Search, Star, Tag, X } from 'lucide-react'
import { Button } from '@/components/custom/Button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const CategoriesSection = () => {
  const [selectedCategories, setSelectedCategories] = useState<
    Array<SelectedCategory>
  >([])
  const [categorySearch, setCategorySearch] = useState('')

  const filteredCategories = mockCategories
    .flatMap((cat) => [
      { id: cat.id, name: cat.name },
      ...cat.children.map((child) => ({
        id: child.id,
        name: `${cat.name} → ${child.name}`,
      })),
    ])
    .filter(
      (cat) =>
        cat.name.toLowerCase().includes(categorySearch.toLowerCase()) &&
        !selectedCategories.find((sc) => sc.id === cat.id),
    )

  const addCategory = (category: { id: string; name: string }) => {
    if (!selectedCategories.find((c) => c.id === category.id)) {
      const isPrimary = selectedCategories.length === 0
      setSelectedCategories([...selectedCategories, { ...category, isPrimary }])
    }
    setCategorySearch('')
  }

  const removeCategory = (categoryId: string) => {
    const updated = selectedCategories.filter((c) => c.id !== categoryId)
    if (updated.length > 0 && !updated.some((c) => c.isPrimary)) {
      updated[0].isPrimary = true
    }
    setSelectedCategories(updated)
  }

  const setPrimaryCategory = (categoryId: string) => {
    setSelectedCategories(
      selectedCategories.map((c) => ({
        ...c,
        isPrimary: c.id === categoryId,
      })),
    )
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Tag className="size-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Kategorije</CardTitle>
            <CardDescription>
              Izaberite kategorije za bolju vidljivost proizvoda
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Categories */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            placeholder="Pretražite kategorije..."
            className="bg-input/50 pl-10 transition-colors focus:bg-input"
          />
        </div>

        {/* Category suggestions dropdown */}
        {categorySearch && filteredCategories.length > 0 && (
          <div className="max-h-48 overflow-y-auto rounded-lg border border-border bg-card">
            {filteredCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => addCategory(cat)}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors hover:bg-muted/50"
              >
                <Plus className="size-4 text-muted-foreground" />
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Selected Categories */}
        {selectedCategories.length > 0 ? (
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Izabrane kategorije
            </Label>
            <div className="space-y-2">
              {selectedCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-3"
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="size-4 cursor-grab text-muted-foreground" />
                    <span className="font-medium">{cat.name}</span>
                    {cat.isPrimary && (
                      <Badge className="gap-1 bg-primary/10 text-primary hover:bg-primary/20">
                        <Star className="size-3" />
                        Primarna
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!cat.isPrimary && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPrimaryCategory(cat.id)}
                        className="h-8 text-xs"
                      >
                        Postavi kao primarnu
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCategory(cat.id)}
                      className="size-8 text-muted-foreground hover:text-destructive"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border py-8 text-center">
            <Tag className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Pretražite i izaberite kategorije za vaš proizvod
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const mockCategories = [
  {
    id: '1',
    name: 'Odeća',
    children: [
      { id: '1a', name: 'Majice' },
      { id: '1b', name: 'Pantalone' },
    ],
  },
  {
    id: '2',
    name: 'Elektronika',
    children: [
      { id: '2a', name: 'Telefoni' },
      { id: '2b', name: 'Laptopovi' },
    ],
  },
  {
    id: '3',
    name: 'Kuća i bašta',
    children: [
      { id: '3a', name: 'Nameštaj' },
      { id: '3b', name: 'Dekoracije' },
    ],
  },
  {
    id: '4',
    name: 'Sport',
    children: [
      { id: '4a', name: 'Fitnes' },
      { id: '4b', name: 'Outdoor' },
    ],
  },
]

type SelectedCategory = {
  id: string
  name: string
  isPrimary: boolean
}
