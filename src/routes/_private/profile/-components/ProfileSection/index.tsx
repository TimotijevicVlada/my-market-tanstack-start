import {
  Camera,
  Check,
  LockIcon,
  MailIcon,
  ShieldCheck,
  UserIcon,
} from 'lucide-react'
import { useLoggedInUser } from '@/api/auth/queries'
import { Button } from '@/components/custom/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getRole } from '@/routes/_private/users/-data'

export const ProfileSection = () => {
  const { data: user } = useLoggedInUser()

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-border/50">
        <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
        <CardContent className="relative pb-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-6">
            <div className="relative -mt-12 sm:-mt-16">
              <Avatar className="size-24 border-4 border-background rounded-full shadow-xl sm:size-28">
                <AvatarImage
                  src={user?.username.charAt(0) || '/placeholder.svg'}
                  alt={user?.username}
                />
                <AvatarFallback className="bg-primary/10 text-3xl font-semibold text-primary">
                  {user?.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105">
                <Camera className="size-4" />
              </button>
            </div>
            <div className="flex-1 text-center sm:pb-1 sm:text-left">
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center">
                <h1 className="text-2xl font-bold tracking-tight">
                  {user?.username}
                </h1>
                <Badge variant="secondary" className="gap-1 font-medium">
                  <ShieldCheck className="size-3" />
                  {user?.role ? getRole[user.role].name : ''}
                </Badge>
              </div>
              <p className="mt-1 text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <UserIcon className="size-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Lični podaci</CardTitle>
                <CardDescription>Vaše osnovne informacije</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Korisničko ime</Label>
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-2">
                <UserIcon className="size-4 text-muted-foreground" />
                <span className="font-medium">{user?.username}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Email adresa</Label>
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-2">
                <MailIcon className="size-4 text-muted-foreground" />
                <span className="font-medium">{user?.email}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Uloga</Label>
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-2">
                <ShieldCheck className="size-4 text-muted-foreground" />
                <span className="font-medium">
                  {user?.role ? getRole[user.role].name : ''}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <MailIcon className="size-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Promena email adrese</CardTitle>
                <CardDescription>Ažurirajte vašu email adresu</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-email">Nova email adresa</Label>
              <Input
                id="new-email"
                type="email"
                placeholder="unesite@novimail.com"
                className="bg-input/50 transition-colors focus:bg-input"
              />
            </div>
            <Button className="w-full gap-2">
              <Check className="size-4" />
              Promeni email
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <LockIcon className="size-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Promena lozinke</CardTitle>
              <CardDescription>
                Zaštitite vaš nalog sa novom lozinkom
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="old-password">Trenutna lozinka</Label>
              <Input
                id="old-password"
                type="password"
                placeholder="••••••••"
                className="bg-input/50 transition-colors focus:bg-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova lozinka</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                className="bg-input/50 transition-colors focus:bg-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Potvrdi lozinku</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                className="bg-input/50 transition-colors focus:bg-input"
              />
            </div>
          </div>
          <Button className="mt-6 w-full gap-2 sm:w-auto">
            <LockIcon className="size-4" />
            Promeni lozinku
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
