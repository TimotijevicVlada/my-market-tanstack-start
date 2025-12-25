import { EyeClosedIcon, EyeIcon, PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useController, useForm } from 'react-hook-form'
import { defaultValues, userSchema } from './schema'
import type { UserSchema } from './schema'
import type { UsersParams } from '@/api/users/queries'
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
import { useCreateUser } from '@/api/users/queries'
import { Label } from '@/components/ui/label'

interface CreateUserProps {
  params: UsersParams
}

export const CreateUser = ({ params }: CreateUserProps) => {
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues,
  })

  const {
    field: { onChange, value: role },
  } = useController({
    name: 'role',
    control: control,
  })

  const { mutate: createUser, isPending } = useCreateUser(params)

  const onSubmit = (data: UserSchema) => {
    createUser(data, {
      onSuccess: () => {
        reset()
        setIsCreateUserModalOpen(false)
      },
    })
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
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormField
              label="Korisničko ime"
              placeholder="Unesite korisničko ime"
              error={errors.username?.message}
              {...register('username')}
            />
            <FormField
              label="Email adresa"
              placeholder="Unesite email adresu"
              error={errors.email?.message}
              {...register('email')}
            />
            <div>
              <Label className="mb-1.5">Uloga</Label>
              <ButtonGroup className="w-full">
                <Button
                  variant={role === 'buyer' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => onChange('buyer')}
                  type="button"
                >
                  Kupac
                </Button>
                <Button
                  variant={role === 'producer' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => onChange('producer')}
                  type="button"
                >
                  Prodavac
                </Button>
                <Button
                  variant={role === 'admin' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => onChange('admin')}
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
              error={errors.password?.message}
              {...register('password')}
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
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => reset()}>
                Ponisti
              </Button>
              <Button
                type="submit"
                loading={{
                  state: isPending,
                  text: 'Kreiranje...',
                }}
              >
                Sačuvaj
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
