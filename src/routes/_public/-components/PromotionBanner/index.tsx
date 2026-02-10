import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/custom/Button'
import { Badge } from '@/components/ui/badge'

export const PromotionBanner = () => {
  return (
    <section className="relative overflow-hidden rounded-2xl">
      <img
        src="/become-seller-banner.avif"
        alt="Promocija"
        className="h-[200px] w-full object-cover md:h-[280px]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent" />
      <div className="absolute inset-0 flex items-center p-8 md:p-12">
        <div className="max-w-md space-y-3">
          <Badge className="bg-primary/20 text-primary">Posebna ponuda</Badge>
          <h2 className="text-balance text-2xl font-bold md:text-3xl">
            Postani prodavac i zarađuj od kuće
          </h2>
          <p className="text-pretty text-sm text-muted-foreground md:text-base">
            Pridruži se hiljadama uspešnih prodavaca na našoj platformi.
            Besplatno otvaranje prodavnice!
          </p>
          <Button className="gap-2">
            Otvori prodavnicu
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
