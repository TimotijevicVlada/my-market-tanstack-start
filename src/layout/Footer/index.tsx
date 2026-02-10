import { Link } from '@tanstack/react-router'
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">
                M
              </div>
              <div>
                <p className="font-bold">My marketplace</p>
                <p className="text-xs text-muted-foreground">
                  Vaš online tržni centar
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Najveći marketplace u regionu sa hiljadama prodavaca i milionima
              proizvoda. Kupujte sigurno, plaćajte jednostavno.
            </p>
            <div className="flex gap-3">
              <Link
                to="/"
                className="flex size-9 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <Facebook className="size-4" />
              </Link>
              <Link
                to="/"
                className="flex size-9 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <Instagram className="size-4" />
              </Link>
              <Link
                to="/"
                className="flex size-9 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <Twitter className="size-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Brzi linkovi</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                'Početna',
                'Sve kategorije',
                'Istaknuti proizvodi',
                'Nove ponude',
                'Postani prodavac',
              ].map((link) => (
                <li key={link}>
                  <Link
                    to="/"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-4">
            <h3 className="font-semibold">Pomoć i podrška</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                'Česta pitanja',
                'Uslovi korišćenja',
                'Politika privatnosti',
                'Reklamacije i povraćaj',
                'Kontaktirajte nas',
              ].map((link) => (
                <li key={link}>
                  <Link
                    to="/"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">Kontakt</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4 flex-shrink-0 text-primary" />
                Beograd, Srbija
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="size-4 flex-shrink-0 text-primary" />
                +381 11 123 4567
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="size-4 flex-shrink-0 text-primary" />
                podrska@marketplace.rs
              </li>
            </ul>
            <div className="rounded-lg border border-border/50 bg-secondary/50 p-3">
              <p className="text-xs font-medium">Radno vreme podrške</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Pon - Pet: 09:00 - 17:00
              </p>
              <p className="text-xs text-muted-foreground">
                Sub: 09:00 - 14:00
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 My marketplace. Sva prava zadržana.
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <Link to="/" className="transition-colors hover:text-primary">
              Uslovi korišćenja
            </Link>
            <Link to="/" className="transition-colors hover:text-primary">
              Politika privatnosti
            </Link>
            <Link to="/" className="transition-colors hover:text-primary">
              Kolačići
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
