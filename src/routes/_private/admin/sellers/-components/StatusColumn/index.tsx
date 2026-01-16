import { useState } from 'react'
import type { Seller } from '@/api/sellers/types'
import { Switch } from '@/components/ui/switch'
import { AlertDialog } from '@/components/custom/AlertDialog'
import { useToggleSellerActiveStatus } from '@/api/sellers/queries'

interface StatusColumnProps {
  seller: Seller
  refetchSellers: () => void
}

export const StatusColumn = ({ seller, refetchSellers }: StatusColumnProps) => {
  const [sellerIdForDeactivation, setSellerIdForDeactivation] = useState<
    string | null
  >(null)

  const {
    mutate: toggleSellerActiveStatus,
    isPending: isTogglingSellerActiveStatus,
  } = useToggleSellerActiveStatus()

  const handleToggleSellerActiveStatus = () => {
    if (!sellerIdForDeactivation) return
    toggleSellerActiveStatus(sellerIdForDeactivation, {
      onSuccess: () => {
        refetchSellers()
        setSellerIdForDeactivation(null)
      },
    })
  }

  const handleActivateSeller = (sellerId: string) => {
    toggleSellerActiveStatus(sellerId, {
      onSuccess: () => {
        refetchSellers()
      },
    })
  }

  return (
    <>
      <Switch
        size="sm"
        checked={seller.isActive}
        onCheckedChange={() => {
          if (seller.isActive) {
            setSellerIdForDeactivation(seller.id)
          } else {
            handleActivateSeller(seller.id)
          }
        }}
      />
      <AlertDialog
        open={!!sellerIdForDeactivation}
        onOpenChange={() => setSellerIdForDeactivation(null)}
        title="Potvrdite deaktivaciju prodavca"
        description={`Da li ste sigurni da želite da deaktivujete prodavca ${seller.displayName.toUpperCase()}?`}
        onConfirm={() => handleToggleSellerActiveStatus()}
        onCancel={() => setSellerIdForDeactivation(null)}
        confirmText="Deaktiviraj"
        loading={{
          state: isTogglingSellerActiveStatus,
          text: 'Deaktiviranje...',
        }}
      />
    </>
  )
}
