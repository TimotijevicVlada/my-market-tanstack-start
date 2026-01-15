import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  updateBasicInfoDefaultValues,
  updateBasicInfoSchema,
} from './zod-schema'
import type { UpdateBasicInfoSchema } from './zod-schema'
import type { MySeller } from '@/api/sellers/types'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/custom/Button'
import { FormField } from '@/components/custom/FormField'
import { Textarea } from '@/components/custom/Textarea'
import { useUpdateMySeller } from '@/api/sellers/queries'

interface EditBasicInfoProps {
  seller: MySeller | null | undefined
  open: boolean
  onOpen: (open: boolean) => void
}

export const EditBasicInfo = ({ seller, open, onOpen }: EditBasicInfoProps) => {
  const methods = useForm<UpdateBasicInfoSchema>({
    resolver: zodResolver(updateBasicInfoSchema),
    defaultValues: updateBasicInfoDefaultValues,
  })

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = methods

  const { mutate: updateSeller, isPending } = useUpdateMySeller()

  const onSubmit = (data: UpdateBasicInfoSchema) => {
    if (!seller) return

    updateSeller(
      {
        ...seller,
        ...data,
        sellerId: seller.id,
      },
      {
        onSuccess: () => {
          methods.reset()
          onOpen(false)
        },
      },
    )
  }

  useEffect(() => {
    if (seller) {
      methods.reset(seller)
    }
  }, [seller])

  return (
    <Dialog open={open} onOpenChange={onOpen}>
      <DialogContent className="max-w-sm sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Osnovne informacije</DialogTitle>
          <Separator />
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormField
              required
              label="Naziv prodavnice"
              placeholder="Unesite naziv prodavnice"
              {...register('displayName')}
              error={errors.displayName?.message}
            />
            <Textarea
              label="Opis"
              placeholder="Primer: Prodavnica koja se bavi prodajom televizora..."
              {...register('description')}
            />
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="ghost" type="button" onClick={() => reset()}>
                Ponisti
              </Button>
              <Button
                type="submit"
                loading={{
                  state: isPending,
                  text: 'Izmena...',
                }}
              >
                Izmeni
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
