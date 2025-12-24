import { EyeClosedIcon, EyeIcon, PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/custom/Button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { FormField } from '@/components/custom/FormField'
import { ButtonGroup } from '@/components/ui/button-group'
import { Label } from '@/components/ui/label'

export const CreateUser = () => {
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleRoleChange = (role: string) => {
    if (selectedRole === role) {
      setSelectedRole(null)
      return
    }
    setSelectedRole(role)
  }

  return (
    <>
      <Button onClick={() => setIsCreateUserModalOpen(true)}>
        <PlusIcon />
        Dodaj korisnika
      </Button>
      <Dialog
        open={isCreateUserModalOpen}
        onOpenChange={() => setIsCreateUserModalOpen(false)}
      >
        <DialogContent className="max-w-sm sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Kreiranje korisnika</DialogTitle>
            <Separator />
          </DialogHeader>
          <form className="flex flex-col gap-4">
            <FormField
              label="Korisničko ime"
              placeholder="Unesite korisničko ime"
            />
            <FormField
              label="Email adresa"
              placeholder="Unesite email adresu"
            />
            <div>
              <Label className="mb-1.5">Uloga</Label>
              <ButtonGroup className="w-full">
                <Button
                  variant={selectedRole === 'buyer' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => handleRoleChange('buyer')}
                  type="button"
                >
                  Kupac
                </Button>
                <Button
                  variant={selectedRole === 'producer' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => handleRoleChange('producer')}
                  type="button"
                >
                  Prodavac
                </Button>
                <Button
                  variant={selectedRole === 'admin' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => handleRoleChange('admin')}
                  type="button"
                >
                  Administrator
                </Button>
              </ButtonGroup>
            </div>
            <FormField
              label="Lozinka"
              placeholder="Unesite lozinku"
              type={showPassword ? 'text' : 'password'}
              endIcon={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  type="button"
                  className="rounded-full"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeIcon /> : <EyeClosedIcon />}
                </Button>
              }
            />
          </form>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateUserModalOpen(false)}
            >
              Odustani
            </Button>
            <Button type="submit">Sačuvaj</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
