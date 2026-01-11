import { useState } from 'react'
import { useController, useFormContext } from 'react-hook-form'
import { EyeClosedIcon, EyeIcon } from 'lucide-react'
import type { UserSchema } from '../zod-schema'
import { Button } from '@/components/custom/Button'
import { FormField } from '@/components/custom/FormField'
import { ButtonGroup } from '@/components/ui/button-group'
import { DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface UserFormProps {
  onFormSubmit: (data: UserSchema) => void
  isSubmitting: boolean
  type: 'create' | 'edit'
}

export const UserForm = ({
  onFormSubmit,
  isSubmitting,
  type,
}: UserFormProps) => {
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useFormContext<UserSchema>()

  const {
    field: { onChange, value: role },
  } = useController({ name: 'role', control })

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onFormSubmit)}>
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
            variant={role === 'seller' ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => onChange('seller')}
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
            Admin
          </Button>
          <Button
            variant={role === 'super-admin' ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => onChange('super-admin')}
            type="button"
          >
            Super Admin
          </Button>
        </ButtonGroup>
      </div>
      {type === 'create' && (
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
      )}
      <DialogFooter>
        <Button variant="outline" type="button" onClick={() => reset()}>
          Ponisti
        </Button>
        <Button
          type="submit"
          loading={{
            state: isSubmitting,
            text: type === 'create' ? 'Kreiranje...' : 'Izmena...',
          }}
        >
          {type === 'create' ? 'Sacuvaj' : 'Izmeni'}
        </Button>
      </DialogFooter>
    </form>
  )
}
