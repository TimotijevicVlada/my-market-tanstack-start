import { LockIcon, MailIcon, UserIcon } from 'lucide-react'
import { useLoggedInUser } from '@/api/auth/queries'
import { Button } from '@/components/custom/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { getRole } from '@/routes/_private/users/-data'

export const ProfileSection = () => {
  const { data: user } = useLoggedInUser()

  return (
    <div>
      <div className="mt-4 max-w-120">
        <div className="flex items-center gap-2">
          <UserIcon className="size-5" />
          <h2 className="text-xl font-bold">Moji podaci</h2>
        </div>
        <Separator className="mb-4" />
        <div className="flex flex-col gap-4">
          <div>
            <Label className="mb-1.5"> Korisničko ime</Label>
            <Input value={user?.username} disabled />
          </div>
          <div>
            <Label className="mb-1.5">Email adresa</Label>
            <Input value={user?.email} disabled />
          </div>
          <div>
            <Label className="mb-1.5">Vaša uloga</Label>
            <Input value={user?.role ? getRole[user.role].name : ''} disabled />
          </div>
        </div>
      </div>

      <div className="mt-10 max-w-120">
        <div className="flex items-center gap-2">
          <MailIcon className="size-5" />
          <h2 className="text-lg font-bold">Promena email adrese</h2>
        </div>
        <Separator className="mb-4" />
        <div className="flex flex-col gap-4">
          <div>
            <Label className="mb-1.5">Nova email adresa</Label>
            <Input placeholder="Unesite novu email adresu" />
          </div>
          <div className="flex justify-end">
            <Button>Promeni email</Button>
          </div>
        </div>
      </div>

      <div className="mt-10 max-w-120">
        <div className="flex items-center gap-2">
          <LockIcon className="size-5" />
          <h2 className="text-lg font-bold">Promena lozinke</h2>
        </div>
        <Separator className="mb-4" />
        <div className="flex flex-col gap-4">
          <div>
            <Label className="mb-1.5">Stara lozinka</Label>
            <Input placeholder="Unesite staru lozinku" />
          </div>
          <div>
            <Label className="mb-1.5">Nova lozinka</Label>
            <Input placeholder="Unesite novu lozinku" />
          </div>
          <div className="flex justify-end">
            <Button>Promeni lozinku</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
