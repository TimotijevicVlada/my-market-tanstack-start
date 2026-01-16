import { useEffect } from 'react'
import { FormProvider, useController, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserIcon } from 'lucide-react'
import { updateAvatarDefaultValues, updateAvatarSchema } from './zod-schema'
import type { User } from '@/api/users/types'
import type { UpdateAvatarSchema } from './zod-schema'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/custom/Button'
import { UploadFileArea } from '@/components/custom/UploadFileArea'
import { getImageUrl } from '@/utils/get-image-url'
import { useUploadToR2 } from '@/api/uploads/queries'
import { useUpdateMyUserAvatar } from '@/api/users/queries'

interface EditAvatarProps {
  user: User | null | undefined
  open: boolean
  onOpen: (open: boolean) => void
}

export const EditAvatar = ({ user, open, onOpen }: EditAvatarProps) => {
  const methods = useForm<UpdateAvatarSchema>({
    resolver: zodResolver(updateAvatarSchema),
    defaultValues: updateAvatarDefaultValues,
  })

  const { handleSubmit, reset, control } = methods

  const { field: avatarUrlField } = useController({
    control,
    name: 'avatarUrl',
  })

  const { mutate: updateAvatar, isPending } = useUpdateMyUserAvatar()

  const onSubmit = (data: UpdateAvatarSchema) => {
    updateAvatar(
      { avatarUrl: data.avatarUrl },
      {
        onSuccess: () => {
          methods.reset()
          onOpen(false)
        },
      },
    )
  }

  const { mutate: uploadImage, isPending: isUploadingImage } = useUploadToR2()

  const onChange = (file: File | null) => {
    if (!file) return

    uploadImage(
      { file, folder: 'test' },
      {
        onSuccess: (data) => {
          avatarUrlField.onChange(data.key)
        },
      },
    )
  }

  useEffect(() => {
    if (user) {
      methods.reset({ avatarUrl: user.avatarUrl })
    }
  }, [user])

  return (
    <Dialog open={open} onOpenChange={onOpen}>
      <DialogContent className="max-w-sm sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Izmena slike profila</DialogTitle>
          <Separator />
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-5">
              <UploadFileArea
                label="Slika profila"
                Icon={UserIcon}
                src={getImageUrl(avatarUrlField.value)}
                onFileChange={(file) => onChange(file)}
                onClear={() => avatarUrlField.onChange(null)}
                isUploading={isUploadingImage}
                footerText="Preporučena veličina: 600x600"
              />
            </div>
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
