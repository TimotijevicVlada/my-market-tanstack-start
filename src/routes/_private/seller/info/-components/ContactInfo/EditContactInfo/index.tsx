import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  updateContactInfoDefaultValues,
  updateContactInfoSchema,
} from './zod-schema'
import type { UpdateContactInfoSchema } from './zod-schema'
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

interface EditContactInfoProps {
  seller: MySeller | null | undefined
  open: boolean
  onOpen: (open: boolean) => void
}

export const EditContactInfo = ({
  seller,
  open,
  onOpen,
}: EditContactInfoProps) => {
  const methods = useForm<UpdateContactInfoSchema>({
    resolver: zodResolver(updateContactInfoSchema),
    defaultValues: updateContactInfoDefaultValues,
  })

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = methods

  const { mutate: updateContactInfo, isPending } = useUpdateMySeller()

  const onSubmit = (data: UpdateContactInfoSchema) => {
    if (!seller) return

    updateContactInfo(
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
          <DialogTitle>Kontakt informacije</DialogTitle>
          <Separator />
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormField
              label="Email"
              placeholder="Unesite email"
              {...register('email')}
              error={errors.email?.message}
            />
            <FormField
              label="Telefon"
              placeholder="Unesite telefon"
              {...register('phone')}
              error={errors.phone?.message}
            />
            <FormField
              label="Website"
              placeholder="Unesite website"
              {...register('website')}
              error={errors.website?.message}
            />
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="ghost" type="button" onClick={() => reset()}>
                Poništi
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
