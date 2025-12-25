import { Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import type { UsersParams } from '@/api/users/queries'
import { Button } from '@/components/custom/Button'
import { useDeleteUser } from '@/api/users/queries'
import { AlertDialog } from '@/components/custom/AlertDialog'
import { Tooltip } from '@/components/custom/Tooltip'

interface DeleteUserProps {
  userId: string
  params: UsersParams
}

export const DeleteUser = ({ userId, params }: DeleteUserProps) => {
  const { mutate: deleteUser, isPending } = useDeleteUser(params)

  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false)

  return (
    <>
      <Tooltip title="Brisanje korisnika">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDeleteUserModalOpen(true)}
          loading={{ state: isPending, text: 'Brisanje...' }}
        >
          <Trash2Icon className="text-red-500" />
        </Button>
      </Tooltip>
      <AlertDialog
        open={isDeleteUserModalOpen}
        onOpenChange={() => setIsDeleteUserModalOpen(false)}
        title="Da li ste sigurni?"
        description="Brisanjem korisnika, nece moci da se uloguje na sistem niti da pristupi stranicama. Ovo je nepovratna akcija koja ne moze biti vracena."
        onConfirm={() => deleteUser({ userId })}
        onCancel={() => setIsDeleteUserModalOpen(false)}
        confirmText="Obrisi"
        loading={{
          state: isPending,
          text: 'Brisanje...',
        }}
      />
    </>
  )
}
