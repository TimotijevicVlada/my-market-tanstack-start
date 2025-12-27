import { useState } from 'react'
import { EyeClosedIcon, EyeIcon, ShieldEllipsisIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { editPasswordDefaultValues, editPasswordSchema } from './zod-schema'
import type { EditPasswordSchema } from './zod-schema'
import type { GetUsersParams } from '@/api/users/types'
import { useEditUserPassword } from '@/api/users/queries'
import { Tooltip } from '@/components/custom/Tooltip'
import { Button } from '@/components/custom/Button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { FormField } from '@/components/custom/FormField'

interface EditPasswordProps {
  userId: string
  params: GetUsersParams
}

export const EditPassword = ({ userId, params }: EditPasswordProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditPasswordSchema>({
    resolver: zodResolver(editPasswordSchema),
    defaultValues: editPasswordDefaultValues,
  })

  const { mutate: editPassword, isPending } = useEditUserPassword(params)

  const onSubmit = (data: EditPasswordSchema) => {
    editPassword(
      { ...data, userId: userId },
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
      <Tooltip title="Izmeni lozinku">
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
          <ShieldEllipsisIcon className="text-purple-500" />
        </Button>
      </Tooltip>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent className="max-w-sm sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Izmena lozinke</DialogTitle>
            <Separator />
          </DialogHeader>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormField
              required
              label="Lozinka"
              placeholder="Unesite novu lozinku"
              type={showPassword ? 'text' : 'password'}
              error={errors.password?.message}
              {...register('password')}
              endIcon={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  type="button"
                  className="rounded-full"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeIcon /> : <EyeClosedIcon />}
                </Button>
              }
            />
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => reset()}>
                Ponisti
              </Button>
              <Button
                type="submit"
                loading={{
                  state: isPending,
                  text: 'Izmena lozinke...',
                }}
              >
                Izmeni lozinku
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
