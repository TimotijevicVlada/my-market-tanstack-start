import { Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import type { GetUsersParams, User } from '@/api/users/types'
import { Button } from '@/components/custom/Button'
import { useDeleteUser } from '@/api/users/queries'
import { AlertDialog } from '@/components/custom/AlertDialog'
import { Tooltip } from '@/components/custom/Tooltip'

interface DeleteUserProps {
  user: User
  params: GetUsersParams
}

export const DeleteUser = ({ user, params }: DeleteUserProps) => {
  const { mutate: deleteUser, isPending } = useDeleteUser(params)

  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Tooltip title="Brisanje korisnika">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
          loading={{ state: isPending, text: 'Brisanje...' }}
        >
          <Trash2Icon className="text-red-500" />
        </Button>
      </Tooltip>
      <AlertDialog
        open={isOpen}
        onOpenChange={() => setIsOpen(false)}
        title="Potvrdite brisanje korisnika"
        description={`Da li ste sigurni da želite da obrišete korisnika ${user.username.toUpperCase()}?`}
        onConfirm={() => deleteUser({ userId: user.id })}
        onCancel={() => setIsOpen(false)}
        confirmText="Obrisi"
        loading={{
          state: isPending,
          text: 'Brisanje...',
        }}
      />
    </>
  )
}
