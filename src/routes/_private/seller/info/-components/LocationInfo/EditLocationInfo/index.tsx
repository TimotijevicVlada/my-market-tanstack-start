import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  updateLocationInfoDefaultValues,
  updateLocationInfoSchema,
} from './zod-schema'
import type { UpdateLocationInfoSchema } from './zod-schema'
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
import { useUpdateMySeller } from '@/api/sellers/queries'

interface EditLocationInfoProps {
  seller: MySeller | null | undefined
  open: boolean
  onOpen: (open: boolean) => void
}

export const EditLocationInfo = ({
  seller,
  open,
  onOpen,
}: EditLocationInfoProps) => {
  const methods = useForm<UpdateLocationInfoSchema>({
    resolver: zodResolver(updateLocationInfoSchema),
    defaultValues: updateLocationInfoDefaultValues,
  })

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = methods

  const { mutate: updateLocationInfo, isPending } = useUpdateMySeller()

  const onSubmit = (data: UpdateLocationInfoSchema) => {
    if (!seller) return

    updateLocationInfo(
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
          <DialogTitle>Informacije o lokaciji</DialogTitle>
          <Separator />
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormField
              label="Država"
              placeholder="Unesite državu"
              {...register('country')}
              error={errors.country?.message}
            />
            <FormField
              label="Grad"
              placeholder="Unesite grad"
              {...register('city')}
              error={errors.city?.message}
            />
            <FormField
              label="Adresa"
              placeholder="Unesite adresu"
              {...register('address')}
              error={errors.address?.message}
            />
            <FormField
              label="Poštanski broj"
              placeholder="Unesite poštanski broj"
              {...register('postalCode')}
              error={errors.postalCode?.message}
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
