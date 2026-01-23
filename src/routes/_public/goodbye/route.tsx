import { Heart, Home, UserPlus } from 'lucide-react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'


export const Route = createFileRoute('/_public/goodbye')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">
        <Card className="border-border/50 bg-card">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-muted">
              <Heart className="size-8 text-muted-foreground" />
            </div>

            <h1 className="mb-3 text-2xl font-semibold text-foreground">
              Doviđenja!
            </h1>

            <p className="mb-6 text-muted-foreground leading-relaxed">
              Vaš nalog je uspešno obrisan. Žao nam je što odlazite, ali poštujemo vašu odluku.
            </p>

            <div className="mb-8 rounded-lg border border-border/50 bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">
                Hvala vam što ste bili deo naše zajednice. Nadamo se da ćemo vas ponovo videti u budućnosti.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button asChild className="w-full gap-2">
                <Link to="/">
                  <Home className="size-4" />
                  Nazad na početnu stranicu
                </Link>
              </Button>

              <p className="text-xs text-muted-foreground">
                Promenili ste mišljenje?
              </p>

              <Button asChild variant="outline" className="w-full gap-2 bg-transparent">
                <Link to="/register">
                  <UserPlus className="size-4" />
                  Kreirajte novi nalog
                </Link>
              </Button>
            </div>

            <p className="mt-8 text-xs text-muted-foreground">
              Ako imate bilo kakvih pitanja, slobodno nas kontaktirajte putem podrške.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
