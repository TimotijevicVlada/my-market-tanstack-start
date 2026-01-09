import { useState } from 'react'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Globe,
  ImageIcon,
  Mail,
  MapPin,
  Phone,
  Plus,
  Store,
  Trash2,
  Upload,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const STEPS = [
  { id: 1, title: 'Opšte', description: 'Osnovne informacije', icon: Store },
  { id: 2, title: 'Kontakt', description: 'Kontakt podaci', icon: Mail },
  { id: 3, title: 'Lokacija', description: 'Adresa prodavnice', icon: MapPin },
  {
    id: 4,
    title: 'Slike',
    description: 'Logo i naslovna slika',
    icon: ImageIcon,
  },
]

const CATEGORIES = [
  'Clothes',
  'Electronics',
  'Home',
  'Sports',
  'Beauty',
  'Books',
  'Food',
  'Other',
]

export function SellerStepperForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1
    name: '',
    categories: [] as Array<string>,
    description: '',
    // Step 2
    email: 'novikorisnik1234@gmail.com',
    phone: '',
    website: '',
    // Step 3
    country: '',
    city: '',
    address: '',
    postalCode: '',
    // Step 4
    logo: null as string | null,
    coverImage: null as string | null,
  })

  const updateFormData = (
    field: string,
    value: string | Array<string> | null,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleCategory = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }))
  }

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.name.trim() !== '' && formData.categories.length > 0
      case 2:
        return true
      case 3:
        return true
      case 4:
        return true
      default:
        return false
    }
  }

  return (
    <div>
      {/* Main Card */}
      <Card className="overflow-hidden border-border/50">
        {/* Header */}
        <div className="border-b border-border/50 bg-card/50 px-6 py-5">
          <h1 className="text-xl font-semibold tracking-tight">
            Kreiranje prodavnice
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Popunite sve korake da biste kreirali vašu prodavnicu
          </p>
        </div>

        {/* Stepper */}
        <div className="border-b border-border/50 bg-muted/30 px-6 py-4">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const StepIcon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id

              return (
                <div key={step.id} className="flex flex-1 items-center">
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={cn(
                      'group flex flex-col items-center gap-2 transition-all',
                      isActive || isCompleted
                        ? 'cursor-pointer'
                        : 'cursor-default',
                    )}
                  >
                    <div
                      className={cn(
                        'flex size-10 items-center justify-center rounded-xl border-2 transition-all md:size-12',
                        isCompleted
                          ? 'border-primary bg-primary text-primary-foreground'
                          : isActive
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border bg-muted/50 text-muted-foreground',
                      )}
                    >
                      {isCompleted ? (
                        <Check className="size-5" />
                      ) : (
                        <StepIcon className="size-5" />
                      )}
                    </div>
                    <div className="text-center">
                      <p
                        className={cn(
                          'text-sm font-medium transition-colors',
                          isActive || isCompleted
                            ? 'text-foreground'
                            : 'text-muted-foreground',
                        )}
                      >
                        {step.title}
                      </p>
                      <p className="hidden text-xs text-muted-foreground md:block">
                        {step.description}
                      </p>
                    </div>
                  </button>
                  {index < STEPS.length - 1 && (
                    <div
                      className={cn(
                        'mx-2 h-0.5 flex-1 rounded-full transition-colors md:mx-4',
                        currentStep > step.id ? 'bg-primary' : 'bg-border',
                      )}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Form Content */}
        <CardContent className="p-6">
          {/* Step 1: General */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Store className="size-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">Opšte informacije</h2>
                  <p className="text-sm text-muted-foreground">
                    Unesite osnovne podatke o prodavnici
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">
                  Naziv prodavca <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Unesite naziv prodavca"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  className="bg-input/50"
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Kategorije <span className="text-destructive">*</span>
                </Label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((category) => (
                    <Badge
                      key={category}
                      variant={
                        formData.categories.includes(category)
                          ? 'default'
                          : 'outline'
                      }
                      className={cn(
                        'cursor-pointer px-3 py-1.5 text-sm transition-all hover:scale-105',
                        formData.categories.includes(category)
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-primary/10',
                      )}
                      onClick={() => toggleCategory(category)}
                    >
                      {formData.categories.includes(category) && (
                        <Check className="mr-1 size-3" />
                      )}
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Opis prodavca</Label>
                <Textarea
                  id="description"
                  placeholder="Opišite vašu prodavnicu..."
                  value={formData.description}
                  onChange={(e) =>
                    updateFormData('description', e.target.value)
                  }
                  className="min-h-[120px] bg-input/50 resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 2: Contact */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="size-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">Kontakt informacije</h2>
                  <p className="text-sm text-muted-foreground">
                    Kako vas kupci mogu kontaktirati
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="bg-input/50 pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+381 XX XXX XXXX"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    className="bg-input/50 pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://www.example.com"
                    value={formData.website}
                    onChange={(e) => updateFormData('website', e.target.value)}
                    className="bg-input/50 pl-10"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="size-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">Lokacija</h2>
                  <p className="text-sm text-muted-foreground">
                    Adresa vaše prodavnice
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="country">Država</Label>
                  <Input
                    id="country"
                    placeholder="Unesite državu"
                    value={formData.country}
                    onChange={(e) => updateFormData('country', e.target.value)}
                    className="bg-input/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Grad</Label>
                  <Input
                    id="city"
                    placeholder="Unesite grad"
                    value={formData.city}
                    onChange={(e) => updateFormData('city', e.target.value)}
                    className="bg-input/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresa</Label>
                <Input
                  id="address"
                  placeholder="Unesite adresu"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  className="bg-input/50"
                />
              </div>

              <div className="space-y-2 sm:max-w-[200px]">
                <Label htmlFor="postalCode">Poštanski broj</Label>
                <Input
                  id="postalCode"
                  placeholder="Unesite poštanski broj"
                  value={formData.postalCode}
                  onChange={(e) => updateFormData('postalCode', e.target.value)}
                  className="bg-input/50"
                />
              </div>
            </div>
          )}

          {/* Step 4: Images */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <ImageIcon className="size-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">Slike</h2>
                  <p className="text-sm text-muted-foreground">
                    Dodajte logo i naslovnu sliku
                  </p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Logo Upload */}
                <div className="space-y-3">
                  <Label>Logo</Label>
                  <div
                    className={cn(
                      'group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all',
                      formData.logo
                        ? 'border-primary/50 bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-primary/5',
                    )}
                  >
                    {formData.logo ? (
                      <>
                        <img
                          src={formData.logo || '/placeholder.svg'}
                          alt="Logo"
                          className="size-24 rounded-full object-cover ring-4 ring-primary/20"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="mt-4 gap-2"
                          onClick={() => updateFormData('logo', null)}
                        >
                          <Trash2 className="size-4" />
                          Obriši
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                          <Upload className="size-6 text-muted-foreground" />
                        </div>
                        <p className="mt-3 text-sm font-medium">
                          Prevucite logo ovde
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ili kliknite da izaberete
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 gap-2 bg-transparent"
                          onClick={() =>
                            updateFormData('logo', '/generic-store-logo.png')
                          }
                        >
                          <Plus className="size-4" />
                          Izaberi fajl
                        </Button>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Preporučena veličina: 200x200px
                  </p>
                </div>

                {/* Cover Image Upload */}
                <div className="space-y-3">
                  <Label>Naslovna slika profila</Label>
                  <div
                    className={cn(
                      'group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all',
                      formData.coverImage
                        ? 'border-primary/50 bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-primary/5',
                    )}
                  >
                    {formData.coverImage ? (
                      <>
                        <img
                          src={formData.coverImage || '/placeholder.svg'}
                          alt="Cover"
                          className="h-24 w-full rounded-lg object-cover ring-2 ring-primary/20"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="mt-4 gap-2"
                          onClick={() => updateFormData('coverImage', null)}
                        >
                          <Trash2 className="size-4" />
                          Obriši
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="flex size-16 items-center justify-center rounded-lg bg-muted">
                          <ImageIcon className="size-6 text-muted-foreground" />
                        </div>
                        <p className="mt-3 text-sm font-medium">
                          Prevucite sliku ovde
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ili kliknite da izaberete
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 gap-2 bg-transparent"
                          onClick={() =>
                            updateFormData(
                              'coverImage',
                              '/generic-store-banner.png',
                            )
                          }
                        >
                          <Plus className="size-4" />
                          Izaberi fajl
                        </Button>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Preporučena veličina: 1200x400px
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border/50 bg-muted/30 px-6 py-4">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ChevronLeft className="size-4" />
            Nazad
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-muted-foreground">
              Poništi
            </Button>
            {currentStep < 4 ? (
              <Button
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                className="gap-2"
              >
                Dalje
                <ChevronRight className="size-4" />
              </Button>
            ) : (
              <Button className="gap-2">
                <Check className="size-4" />
                Sačuvaj
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
