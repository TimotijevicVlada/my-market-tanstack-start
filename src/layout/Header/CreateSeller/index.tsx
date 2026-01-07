import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { SellerForm } from '@/routes/_private/sellers/-components/SellerForm'

interface CreateSellerProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export const CreateSeller = ({ isOpen, setIsOpen }: CreateSellerProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogContent className="max-w-sm sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Kreiranje prodavca</DialogTitle>
          <Separator />
        </DialogHeader>
        <SellerForm
          onFormSubmit={(data) => console.log(data)}
          isSubmitting={false}
          type="create"
        />
      </DialogContent>
    </Dialog>
  )
}
