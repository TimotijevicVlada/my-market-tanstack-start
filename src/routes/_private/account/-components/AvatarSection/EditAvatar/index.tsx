import { useEffect, useState } from 'react'
import { FormProvider, useController, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserIcon } from 'lucide-react'
import { updateAvatarDefaultValues, updateAvatarSchema } from './zod-schema'
import type { Session } from '@/lib/auth'
import type { UpdateAvatarSchema } from './zod-schema'
import type { FileWithPreview } from '@/components/custom/ImageCropper'
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
import { useUploadToR2 } from '@/api/uploads/queries'
import { useUpdateSessionUserAvatar } from '@/api/auth/queries'
import { ImageCropper } from '@/components/custom/ImageCropper'

interface EditAvatarProps {
  user: Session['user'] | undefined
  open: boolean
  onOpen: (open: boolean) => void
}

export const EditAvatar = ({ user, open, onOpen }: EditAvatarProps) => {
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(null)

  const methods = useForm<UpdateAvatarSchema>({
    resolver: zodResolver(updateAvatarSchema),
    defaultValues: updateAvatarDefaultValues,
  })

  const { handleSubmit, reset, control } = methods

  const { field: avatarUrlField } = useController({
    control,
    name: 'avatarUrl',
  })

  const { mutate: updateAvatar, isPending } = useUpdateSessionUserAvatar()

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

  const { mutateAsync: uploadImage, isPending: isUploadingImage } =
    useUploadToR2()

  const onSave = async (image: string) => {
    const response = await fetch(image)
    const blob = await response.blob()
    const file = new File([blob], 'avatar.png', { type: blob.type })
    const result = await uploadImage({ file, folder: 'test' })
    avatarUrlField.onChange(result.publicUrl)
    setSelectedFile(null)
  }

  const handleChange = (file: File | Array<File>) => {
    const actualFile = Array.isArray(file) ? file[0] : file
    const fileWithPreview = Object.assign(actualFile, {
      preview: URL.createObjectURL(actualFile),
    })
    setSelectedFile(fileWithPreview)
  }

  useEffect(() => {
    if (user) {
      methods.reset({ avatarUrl: user.image })
    }
  }, [user])

  return (
    <>
      {selectedFile && (
        <ImageCropper
          dialogOpen={!!selectedFile}
          setDialogOpen={() => setSelectedFile(null)}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          onSave={onSave}
          circularCrop
        />
      )}
      <Dialog open={open && !selectedFile} onOpenChange={onOpen}>
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
                  src={avatarUrlField.value}
                  onFileChange={handleChange}
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
    </>
  )
}
