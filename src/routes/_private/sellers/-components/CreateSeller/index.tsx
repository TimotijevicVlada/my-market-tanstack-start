import { useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { SellerForm } from '../SellerForm'
import type { CreateSellerPayload, GetSellerParams } from '@/api/sellers/types'
import { Button } from '@/components/custom/Button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useCreateSeller } from '@/api/sellers/queries'

interface CreateSellerProps {
  params: GetSellerParams
}

export const CreateSeller = ({ params }: CreateSellerProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const { mutate: createSeller, isPending } = useCreateSeller(params)

  const onFormSubmit = (data: CreateSellerPayload) => {
    createSeller(data, {
      onSuccess: () => {
        setIsOpen(false)
      },
    })
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <PlusIcon />
        Dodaj prodavca
      </Button>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent className="max-w-sm sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Kreiranje prodavca</DialogTitle>
            <Separator />
          </DialogHeader>
          <SellerForm
            onFormSubmit={onFormSubmit}
            isSubmitting={isPending}
            type="create"
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
