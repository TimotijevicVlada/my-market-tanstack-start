import { useState } from 'react'
import { PencilIcon } from 'lucide-react'
import { SellerForm } from '../SellerForm'
import type {
  CreateSellerPayload,
  GetSellerParams,
  Seller,
} from '@/api/sellers/types'
import { Button } from '@/components/custom/Button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useUpdateSeller } from '@/api/sellers/queries'

interface UpdateSellerProps {
  params: GetSellerParams
  seller: Seller
}

export const UpdateSeller = ({ params, seller }: UpdateSellerProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const { mutate: updateSeller, isPending } = useUpdateSeller(params)

  const onFormSubmit = (data: CreateSellerPayload) => {
    updateSeller(
      {
        ...data,
        sellerId: seller.id,
      },
      {
        onSuccess: () => {
          setIsOpen(false)
        },
      },
    )
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setIsOpen(true)}
        disabled={!seller.isActive || seller.status === 'rejected'}
      >
        <PencilIcon className="text-orange-500" />
      </Button>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent className="max-w-sm sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Azuriranje prodavca</DialogTitle>
            <Separator />
          </DialogHeader>
          <SellerForm
            onFormSubmit={onFormSubmit}
            isSubmitting={isPending}
            type="edit"
            sellerToEdit={seller}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
