import { useState } from 'react'
import { Ban, CircleCheckBig, ShieldCheck } from 'lucide-react'
import { useController, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  baseSchema,
  rejectedSchema,
  verifySellerDefaultValues,
} from './zod-schema'
import type { GetSellerParams, Seller } from '@/api/sellers/types'
import type { VerifySellerSchema } from './zod-schema'
import { Button } from '@/components/custom/Button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/custom/Textarea'
import { Label } from '@/components/ui/label'
import { ButtonGroup } from '@/components/ui/button-group'
import { FieldDescription } from '@/components/ui/field'
import { useVerifySeller } from '@/api/sellers/queries'

interface VerifySellerProps {
  seller: Seller
  params: GetSellerParams
}

export const VerifySeller = ({ seller, params }: VerifySellerProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<VerifySellerSchema>({
    resolver: (values, context, options) => {
      const selectedSchema =
        values.status === 'rejected' ? rejectedSchema : baseSchema
      return zodResolver(selectedSchema)(values, context, options as any) as any
    },
    defaultValues: verifySellerDefaultValues,
  })

  const { field: statusField } = useController({ name: 'status', control })

  const { mutate: verifySeller, isPending } = useVerifySeller(params)

  const onSubmit = (data: VerifySellerSchema) => {
    verifySeller(
      {
        sellerId: seller.id,
        status: data.status as Seller['status'],
        verificationNote: data.verificationNote,
      },
      {
        onSuccess: () => {
          reset()
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
        disabled={seller.status !== 'pending'}
        onClick={() => setIsOpen(true)}
      >
        <ShieldCheck
          className={`${seller.status === 'pending' ? 'text-blue-500' : 'text-muted-foreground'}`}
        />
      </Button>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent className="max-w-sm sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verifikacija prodavca</DialogTitle>
            <Separator />
          </DialogHeader>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <Label className="mb-1.5">
                Status verifikacije
                <span className="text-destructive font-bold">*</span>
              </Label>
              <ButtonGroup className="w-full">
                <Button
                  variant={
                    statusField.value === 'approved' ? 'default' : 'outline'
                  }
                  className="flex-1"
                  onClick={() => {
                    statusField.onChange('approved')
                    setValue('verificationNote', '')
                  }}
                  type="button"
                >
                  <CircleCheckBig />
                  Odobren
                </Button>
                <Button
                  variant={
                    statusField.value === 'rejected' ? 'default' : 'outline'
                  }
                  className="flex-1"
                  onClick={() => statusField.onChange('rejected')}
                  type="button"
                >
                  <Ban />
                  Odbijen
                </Button>
              </ButtonGroup>
              {errors.status?.message && (
                <FieldDescription className="text-destructive">
                  {errors.status.message}
                </FieldDescription>
              )}
            </div>
            {statusField.value === 'rejected' && (
              <Textarea
                required
                label="Razlog odbijanja"
                placeholder="Unesite razlog odbijanja"
                error={errors.verificationNote?.message}
                {...register('verificationNote')}
              />
            )}
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => reset()}>
                Ponisti
              </Button>
              <Button
                type="submit"
                loading={{
                  state: isPending,
                  text: 'Verifikacija...',
                }}
              >
                Potvrdi
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
