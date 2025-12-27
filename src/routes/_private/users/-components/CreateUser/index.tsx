import { EyeClosedIcon, EyeIcon, PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useController, useForm } from 'react-hook-form'
import { createUserDefaultValues, createUserSchema } from '../zod-schema'
import type { CreateUserSchema } from '../zod-schema'
import type { GetUsersParams } from '@/api/users/types'
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
  params: GetUsersParams
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export const CreateUser = ({ params, isOpen, setIsOpen }: CreateUserProps) => {
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: createUserDefaultValues,
  })

  const {
    field: { onChange, value: role },
  } = useController({
    name: 'role',
    control: control,
  })

  const { mutate: createUser, isPending } = useCreateUser(params)

  const onSubmit = (data: CreateUserSchema) => {
    createUser(data, {
      onSuccess: () => {
        reset()
        setIsOpen(false)
      },
    })
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <PlusIcon />
        Dodaj korisnika
      </Button>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
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
              required
              label="Korisničko ime"
              placeholder="Unesite korisničko ime"
              error={errors.username?.message}
              {...register('username')}
            />
            <FormField
              required
              label="Email adresa"
              placeholder="Unesite email adresu"
              error={errors.email?.message}
              {...register('email')}
            />
            <div>
              <Label className="mb-1.5">
                Uloga <span className="text-destructive font-bold">*</span>
              </Label>
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
              required
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
