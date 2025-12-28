import { useEffect, useState } from 'react'
import { PencilIcon } from 'lucide-react'
import { useController, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { baseSchema, editUserDefaultValues } from '../zod-schema'
import type { EditUserSchema } from '../zod-schema'
import type { GetUsersParams, User } from '@/api/users/types'
import { Button } from '@/components/custom/Button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { ButtonGroup } from '@/components/ui/button-group'
import { FormField } from '@/components/custom/FormField'
import { Label } from '@/components/ui/label'
import { useEditUser } from '@/api/users/queries'
import { Tooltip } from '@/components/custom/Tooltip'

interface EditUserProps {
  user: User
  params: GetUsersParams
}

export const EditUser = ({ user, params }: EditUserProps) => {
  const [userToEdit, setUserToEdit] = useState<User | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<EditUserSchema>({
    resolver: zodResolver(baseSchema),
    defaultValues: editUserDefaultValues,
  })

  const {
    field: { onChange, value: role },
  } = useController({
    name: 'role',
    control: control,
  })

  const { mutate: editUser, isPending } = useEditUser(params)

  const onSubmit = (data: EditUserSchema) => {
    editUser(
      { ...data, userId: userToEdit?.id ?? '' },
      {
        onSuccess: () => {
          reset()
          setUserToEdit(null)
        },
      },
    )
  }

  useEffect(() => {
    if (userToEdit) {
      reset(userToEdit)
    }
  }, [userToEdit])

  return (
    <>
      <Tooltip title="Izmena korisnika">
        <Button
          variant="ghost"
          size="icon"
          disabled={!user.isActive}
          onClick={() => setUserToEdit(user)}
        >
          <PencilIcon className="text-orange-500" />
        </Button>
      </Tooltip>
      <Dialog open={!!userToEdit} onOpenChange={() => setUserToEdit(null)}>
        <DialogContent className="max-w-sm sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Izmena korisnika</DialogTitle>
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
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => reset()}>
                Ponisti
              </Button>
              <Button
                type="submit"
                loading={{
                  state: isPending,
                  text: 'Izmena...',
                }}
              >
                Izmeni
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
