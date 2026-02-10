import { Clock, CreditCard, ShieldCheck, Truck } from 'lucide-react'

export const TrustBadges = () => {
  return (
    <section className="border-b border-border/50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 py-6 md:grid-cols-4">
        {trustBadges.map((item) => (
          <div key={item.title} className="flex items-center gap-3">
            <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <item.icon className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

const trustBadges = [
  {
    icon: Truck,
    title: 'Besplatna dostava',
    desc: 'Za porudžbine preko 5.000 din',
  },
  {
    icon: ShieldCheck,
    title: 'Sigurna kupovina',
    desc: '100% zaštita kupca',
  },
  {
    icon: CreditCard,
    title: 'Sigurno plaćanje',
    desc: 'Karticom ili pouzećem',
  },
  { icon: Clock, title: 'Brza dostava', desc: '2-5 radnih dana' },
]
