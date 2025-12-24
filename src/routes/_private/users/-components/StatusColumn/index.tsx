import { useState } from 'react'
import type { User } from '@/api/users/types'
import { useToggleUserActiveStatus } from '@/api/users/queries'
import { Button } from '@/components/custom/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'

interface StatusColumnProps {
  user: User
  refetchUsers: () => void
}

export const StatusColumn = ({ user, refetchUsers }: StatusColumnProps) => {
  const [userIdForDeactivation, setUserIdForDeactivation] = useState<
    string | null
  >(null)

  const {
    mutate: toggleUserActiveStatus,
    isPending: isTogglingUserActiveStatus,
  } = useToggleUserActiveStatus()

  const handleToggleUserActiveStatus = () => {
    if (!userIdForDeactivation) return
    toggleUserActiveStatus(
      { userId: userIdForDeactivation },
      {
        onSuccess: () => {
          refetchUsers()
          setUserIdForDeactivation(null)
        },
      },
    )
  }

  const handleActivateUser = (userId: string) => {
    toggleUserActiveStatus(
      { userId },
      {
        onSuccess: () => {
          refetchUsers()
        },
      },
    )
  }

  return (
    <>
      <Switch
        checked={user.isActive}
        onCheckedChange={() => {
          if (user.isActive) {
            setUserIdForDeactivation(user.id)
          } else {
            handleActivateUser(user.id)
          }
        }}
      />
      <Dialog
        open={!!userIdForDeactivation}
        onOpenChange={() => setUserIdForDeactivation(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Da li ste sigurni?</DialogTitle>
            <DialogDescription>
              Deaktiviranjem korisnik nece moci da se uloguje na sistem niti da
              pristupi stranicama.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUserIdForDeactivation(null)}
            >
              Odustani
            </Button>
            <Button
              onClick={() => handleToggleUserActiveStatus()}
              loading={{
                state: isTogglingUserActiveStatus,
                text: 'Deaktiviranje...',
              }}
              variant="destructive"
            >
              Deaktiviraj
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
