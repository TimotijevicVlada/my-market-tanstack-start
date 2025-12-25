import { Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import type { UsersParams } from '@/api/users/queries'
import { Button } from '@/components/custom/Button'
import { useDeleteUser } from '@/api/users/queries'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface DeleteUserProps {
  userId: string
  params: UsersParams
}

export const DeleteUser = ({ userId, params }: DeleteUserProps) => {
  const { mutate: deleteUser, isPending } = useDeleteUser(params)

  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsDeleteUserModalOpen(true)}
        loading={{ state: isPending, text: 'Brisanje...' }}
      >
        <Trash2Icon className="text-red-500" />
      </Button>
      <Dialog
        open={isDeleteUserModalOpen}
        onOpenChange={() => setIsDeleteUserModalOpen(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Da li ste sigurni?</DialogTitle>
            <DialogDescription>
              Brisanjem korisnika, nece moci da se uloguje na sistem niti da
              pristupi stranicama. Ovo je nepovratna akcija koja ne moze biti
              vracena.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteUserModalOpen(false)}
            >
              Odustani
            </Button>
            <Button
              onClick={() => deleteUser({ userId })}
              loading={{
                state: isPending,
                text: 'Brisanje...',
              }}
              variant="destructive"
            >
              Obrisi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
