import { useState } from "react"
import { createFileRoute } from '@tanstack/react-router'
import {
  DollarSign,
  Eye,
  FileText,
  Globe,
  GripVertical,
  ImageIcon,
  Info,
  Package,
  Plus,
  Save,
  Search,
  Star,
  Tag,
  Trash2,
  Warehouse,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export const Route = createFileRoute('/_private/seller/products/create/')({
  component: () => {
    // Basic info
    const [name, setName] = useState("")
    const [slug, setSlug] = useState("")
    const [description, setDescription] = useState("")
    const [sku, setSku] = useState("")

    // Pricing
    const [price, setPrice] = useState("")
    const [compareAtPrice, setCompareAtPrice] = useState("")
    const [currency, setCurrency] = useState("RSD")

    // Inventory
    const [unit, setUnit] = useState("piece")
    const [trackInventory, setTrackInventory] = useState(true)
    const [stockQty, setStockQty] = useState("")
    const [lowStockThreshold, setLowStockThreshold] = useState("")

    // Categories
    const [selectedCategories, setSelectedCategories] = useState<Array<SelectedCategory>>([])
    const [categorySearch, setCategorySearch] = useState("")

    // Tags
    const [tags, setTags] = useState<Array<string>>([])
    const [newTag, setNewTag] = useState("")

    // Images
    const [images, setImages] = useState<Array<ProductImage>>([])

    // SEO
    const [seoTitle, setSeoTitle] = useState("")
    const [seoDescription, setSeoDescription] = useState("")

    // Status
    const [status, setStatus] = useState("draft")

    // Generate slug from name
    const generateSlug = (text: string) => {
      return text
        .toLowerCase()
        .replace(/[čć]/g, "c")
        .replace(/[šś]/g, "s")
        .replace(/ž/g, "z")
        .replace(/đ/g, "dj")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    }

    const handleNameChange = (value: string) => {
      setName(value)
      if (!slug || slug === generateSlug(name)) {
        setSlug(generateSlug(value))
      }
    }

    // Category handlers
    const addCategory = (category: { id: string; name: string }) => {
      if (!selectedCategories.find((c) => c.id === category.id)) {
        const isPrimary = selectedCategories.length === 0
        setSelectedCategories([...selectedCategories, { ...category, isPrimary }])
      }
      setCategorySearch("")
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
        }))
      )
    }

    // Tag handlers
    const addTag = () => {
      if (newTag && !tags.includes(newTag.toLowerCase())) {
        setTags([...tags, newTag.toLowerCase()])
        setNewTag("")
      }
    }

    const removeTag = (tag: string) => {
      setTags(tags.filter((t) => t !== tag))
    }

    // Image handlers
    const addImage = () => {
      const newImage: ProductImage = {
        id: Math.random().toString(36).substr(2, 9),
        url: "",
        alt: "",
        isPrimary: images.length === 0,
      }
      setImages([...images, newImage])
    }

    const updateImage = (id: string, field: keyof ProductImage, value: string | boolean) => {
      setImages(
        images.map((img) => (img.id === id ? { ...img, [field]: value } : img))
      )
    }

    const removeImage = (id: string) => {
      const updated = images.filter((img) => img.id !== id)
      if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
        updated[0].isPrimary = true
      }
      setImages(updated)
    }

    const setPrimaryImage = (id: string) => {
      setImages(
        images.map((img) => ({
          ...img,
          isPrimary: img.id === id,
        }))
      )
    }

    // Filter categories based on search
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
          !selectedCategories.find((sc) => sc.id === cat.id)
      )

    const getCurrencySymbol = () => {
      return currencies.find((c) => c.value === currency)?.symbol || ""
    }

    return (
      <div className="min-h-screen bg-background p-6 md:p-8">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Page Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Kreiranje proizvoda</h1>
              <p className="mt-1 text-muted-foreground">
                Popunite informacije o vašem proizvodu
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Eye className="size-4" />
                Pregled
              </Button>
              <Button className="gap-2">
                <Save className="size-4" />
                Sačuvaj proizvod
              </Button>
            </div>
          </div>

          {/* Status Bar */}
          <Card className="border-border/50">
            <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-3">
                <Label htmlFor="status" className="text-muted-foreground">
                  Status proizvoda:
                </Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status" className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <span
                            className={`size-2 rounded-full ${option.value === "published"
                              ? "bg-green-500"
                              : option.value === "draft"
                                ? "bg-yellow-500"
                                : "bg-muted-foreground"
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

          {/* Basic Information Section */}
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Package className="size-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Osnovne informacije</CardTitle>
                  <CardDescription>Naziv, opis i identifikacija proizvoda</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Naziv proizvoda <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="npr. Pamučna majica Classic"
                    className="bg-input/50 transition-colors focus:bg-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">
                    URL slug <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="pamucna-majica-classic"
                    className="bg-input/50 font-mono text-sm transition-colors focus:bg-input"
                  />
                  <p className="text-xs text-muted-foreground">
                    Automatski generisan iz naziva
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Opis proizvoda</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Opišite vaš proizvod detaljno..."
                  className="min-h-[150px] bg-input/50 transition-colors focus:bg-input"
                />
                <p className="text-xs text-muted-foreground">
                  Podržava formatiranje teksta (bold, italic, liste...)
                </p>
              </div>

              <div className="space-y-2 md:w-1/2">
                <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                <Input
                  id="sku"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="npr. MAJ-001-BEL-L"
                  className="bg-input/50 font-mono transition-colors focus:bg-input"
                />
                <p className="text-xs text-muted-foreground">
                  Jedinstveni kod za internu evidenciju
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Section */}
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <DollarSign className="size-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Cena</CardTitle>
                  <CardDescription>Postavite cenu i valutu za vaš proizvod</CardDescription>
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
                    <span className="font-medium text-green-500">Popust aktivan: </span>
                    <span className="text-muted-foreground">
                      {Math.round(
                        ((Number(compareAtPrice) - Number(price)) / Number(compareAtPrice)) * 100
                      )}
                      % niža cena od prethodne
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Inventory Section */}
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Warehouse className="size-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Zalihe</CardTitle>
                  <CardDescription>Upravljajte količinom i jedinicom mere</CardDescription>
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

          {/* Categories Section */}
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

          {/* Tags Section */}
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Tag className="size-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Tagovi</CardTitle>
                  <CardDescription>
                    Dodajte tagove za lakše pretraživanje
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="Unesite tag i pritisnite Enter"
                  className="bg-input/50 transition-colors focus:bg-input"
                />
                <Button variant="outline" onClick={addTag} disabled={!newTag}>
                  <Plus className="size-4" />
                </Button>
              </div>

              {tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="gap-1.5 px-3 py-1.5"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 rounded-full p-0.5 transition-colors hover:bg-foreground/10"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Još nema tagova. Dodajte tagove poput "organsko", "novo", "akcija"...
                </p>
              )}
            </CardContent>
          </Card>

          {/* Images Section */}
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <ImageIcon className="size-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Slike proizvoda</CardTitle>
                    <CardDescription>
                      Dodajte fotografije vašeg proizvoda
                    </CardDescription>
                  </div>
                </div>
                <Button variant="outline" onClick={addImage} className="gap-2 bg-transparent">
                  <Plus className="size-4" />
                  Dodaj sliku
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {images.length > 0 ? (
                <div className="space-y-4">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="flex flex-col gap-4 rounded-lg border border-border/50 bg-muted/30 p-4 sm:flex-row sm:items-start"
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical className="hidden size-5 cursor-grab text-muted-foreground sm:block" />
                        <div className="relative size-24 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                          {image.url ? (
                            <img
                              src={image.url || "/placeholder.svg"}
                              alt={image.alt || "Product image"}
                              className="size-full object-cover"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center">
                              <ImageIcon className="size-8 text-muted-foreground" />
                            </div>
                          )}
                          {image.isPrimary && (
                            <div className="absolute left-1 top-1">
                              <Badge className="gap-1 bg-primary px-1.5 py-0.5 text-xs">
                                <Star className="size-3" />
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">URL slike</Label>
                          <Input
                            value={image.url}
                            onChange={(e) => updateImage(image.id, "url", e.target.value)}
                            placeholder="https://..."
                            className="bg-input/50 text-sm transition-colors focus:bg-input"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Alt tekst</Label>
                          <Input
                            value={image.alt}
                            onChange={(e) => updateImage(image.id, "alt", e.target.value)}
                            placeholder="Opis slike za pristupačnost"
                            className="bg-input/50 text-sm transition-colors focus:bg-input"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 sm:flex-col">
                        {!image.isPrimary && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPrimaryImage(image.id)}
                            className="h-8 gap-1.5 text-xs"
                          >
                            <Star className="size-3" />
                            Primarna
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImage(image.id)}
                          className="h-8 gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="size-3" />
                          Obriši
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border py-12 text-center">
                  <ImageIcon className="mx-auto size-10 text-muted-foreground" />
                  <p className="mt-3 font-medium">Nema dodatih slika</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Kliknite "Dodaj sliku" da dodate fotografije proizvoda
                  </p>
                  <Button variant="outline" onClick={addImage} className="mt-4 gap-2 bg-transparent">
                    <Plus className="size-4" />
                    Dodaj prvu sliku
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* SEO Section */}
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Globe className="size-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">SEO podešavanja</CardTitle>
                  <CardDescription>
                    Optimizujte proizvod za pretraživače
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="seoTitle">SEO naslov</Label>
                  <span className="text-xs text-muted-foreground">
                    {seoTitle.length}/70
                  </span>
                </div>
                <Input
                  id="seoTitle"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={name || "Naslov za pretraživače"}
                  maxLength={70}
                  className="bg-input/50 transition-colors focus:bg-input"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="seoDescription">SEO opis</Label>
                  <span className="text-xs text-muted-foreground">
                    {seoDescription.length}/160
                  </span>
                </div>
                <Textarea
                  id="seoDescription"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Kratak opis koji će se prikazati u rezultatima pretrage..."
                  maxLength={160}
                  className="min-h-[80px] bg-input/50 transition-colors focus:bg-input"
                />
              </div>

              {/* SEO Preview */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Pregled u pretraživaču</Label>
                <div className="rounded-lg border border-border bg-white p-4">
                  <p className="text-lg text-[#1a0dab] hover:underline">
                    {seoTitle || name || "Naziv proizvoda"}
                  </p>
                  <p className="mt-1 text-sm text-[#006621]">
                    vasaprodavnica.rs › proizvodi › {slug || "naziv-proizvoda"}
                  </p>
                  <p className="mt-1 text-sm text-[#545454]">
                    {seoDescription || description.substring(0, 160) || "Opis vašeg proizvoda će se prikazati ovde..."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
            <Button variant="outline" className="gap-2 bg-transparent">
              <FileText className="size-4" />
              Sačuvaj kao nacrt
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Eye className="size-4" />
                Pregled
              </Button>
              <Button className="gap-2">
                <Save className="size-4" />
                Sačuvaj i objavi
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  },
})


// Mock categories for demo
const mockCategories = [
  { id: "1", name: "Odeća", children: [{ id: "1a", name: "Majice" }, { id: "1b", name: "Pantalone" }] },
  { id: "2", name: "Elektronika", children: [{ id: "2a", name: "Telefoni" }, { id: "2b", name: "Laptopovi" }] },
  { id: "3", name: "Kuća i bašta", children: [{ id: "3a", name: "Nameštaj" }, { id: "3b", name: "Dekoracije" }] },
  { id: "4", name: "Sport", children: [{ id: "4a", name: "Fitnes" }, { id: "4b", name: "Outdoor" }] },
]

// Currency options
const currencies = [
  { value: "RSD", label: "RSD", symbol: "дин." },
  { value: "EUR", label: "EUR", symbol: "€" },
  { value: "USD", label: "USD", symbol: "$" },
]

// Unit options
const units = [
  { value: "piece", label: "Komad" },
  { value: "kg", label: "Kilogram (kg)" },
  { value: "g", label: "Gram (g)" },
  { value: "lb", label: "Funta (lb)" },
  { value: "oz", label: "Unca (oz)" },
  { value: "liter", label: "Litar (L)" },
  { value: "gallon", label: "Galon" },
  { value: "bunch", label: "Svežanj" },
  { value: "dozen", label: "Tuce (12 kom)" },
  { value: "box", label: "Kutija" },
]

// Status options
const statusOptions = [
  { value: "draft", label: "Nacrt", description: "Proizvod nije vidljiv kupcima" },
  { value: "published", label: "Objavljen", description: "Proizvod je aktivan i vidljiv" },
  { value: "archived", label: "Arhiviran", description: "Proizvod je uklonjen iz ponude" },
]

type ProductImage = {
  id: string
  url: string
  alt: string
  isPrimary: boolean
}

type SelectedCategory = {
  id: string
  name: string
  isPrimary: boolean
}

