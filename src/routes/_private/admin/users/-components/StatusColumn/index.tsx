import { useState } from 'react'
import type { User } from '@/api/users/types'
import { useToggleUserActiveStatus } from '@/api/users/queries'
import { Switch } from '@/components/ui/switch'
import { AlertDialog } from '@/components/custom/AlertDialog'

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
        size="sm"
        checked={user.isActive}
        onCheckedChange={() => {
          if (user.isActive) {
            setUserIdForDeactivation(user.id)
          } else {
            handleActivateUser(user.id)
          }
        }}
      />
      <AlertDialog
        open={!!userIdForDeactivation}
        onOpenChange={() => setUserIdForDeactivation(null)}
        title="Potvrdite deaktivaciju korisnika"
        description={`Da li ste sigurni da želite da deaktivujete korisnika ${user.username.toUpperCase()}?`}
        onConfirm={() => handleToggleUserActiveStatus()}
        onCancel={() => setUserIdForDeactivation(null)}
        confirmText="Deaktiviraj"
        loading={{
          state: isTogglingUserActiveStatus,
          text: 'Deaktiviranje...',
        }}
      />
    </>
  )
}
