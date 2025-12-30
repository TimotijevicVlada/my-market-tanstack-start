import { useEffect, useState } from 'react'
import { PencilIcon } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { baseSchema, editUserDefaultValues } from '../zod-schema'
import { UserForm } from '../UserForm'
import type { EditUserSchema } from '../zod-schema'
import type { GetUsersParams, User } from '@/api/users/types'
import { Button } from '@/components/custom/Button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useEditUser } from '@/api/users/queries'
import { Tooltip } from '@/components/custom/Tooltip'

interface EditUserProps {
  user: User
  params: GetUsersParams
}

export const EditUser = ({ user, params }: EditUserProps) => {
  const [userToEdit, setUserToEdit] = useState<User | null>(null)

  const methods = useForm<EditUserSchema>({
    resolver: zodResolver(baseSchema),
    defaultValues: editUserDefaultValues,
  })

  const { mutate: editUser, isPending } = useEditUser(params)

  const onFormSubmit = (data: EditUserSchema) => {
    editUser(
      { ...data, userId: userToEdit?.id ?? '' },
      {
        onSuccess: () => {
          setUserToEdit(null)
        },
      },
    )
  }

  useEffect(() => {
    if (userToEdit) {
      methods.reset(userToEdit)
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
          <FormProvider {...methods}>
            <UserForm
              onFormSubmit={onFormSubmit}
              isSubmitting={isPending}
              type="edit"
            />
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  )
}
