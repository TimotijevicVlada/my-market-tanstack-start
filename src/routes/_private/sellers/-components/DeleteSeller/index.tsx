import { Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import type { GetSellerParams, Seller } from '@/api/sellers/types'
import { Button } from '@/components/custom/Button'
import { AlertDialog } from '@/components/custom/AlertDialog'
import { Tooltip } from '@/components/custom/Tooltip'
import { useDeleteSeller } from '@/api/sellers/queries'

interface DeleteSellerProps {
  seller: Seller
  params: GetSellerParams
}

export const DeleteSeller = ({ seller, params }: DeleteSellerProps) => {
  const { mutate: deleteSeller, isPending } = useDeleteSeller(params)

  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Tooltip title="Brisanje prodavca">
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
        title="Potvrdite brisanje prodavca"
        description={`Da li ste sigurni da želite da obrišete prodavca ${seller.displayName.toUpperCase()}?`}
        onConfirm={() => deleteSeller(seller.id)}
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
