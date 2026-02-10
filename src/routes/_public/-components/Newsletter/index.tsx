import { Button } from '@/components/custom/Button'

export const Newsletter = () => {
  return (
    <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-8 text-center md:p-12">
      <h2 className="text-balance text-2xl font-bold md:text-3xl">
        Budite u toku sa najboljim ponudama
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-pretty text-muted-foreground">
        Prijavite se na naš newsletter i prvi saznajte za nove proizvode,
        popuste i ekskluzivne ponude.
      </p>
      <div className="mx-auto mt-6 flex max-w-md gap-2">
        <input
          type="email"
          placeholder="Vaša email adresa"
          className="flex-1 rounded-lg border border-border bg-input px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <Button className="flex-shrink-0">Prijavi se</Button>
      </div>
    </section>
  )
}
