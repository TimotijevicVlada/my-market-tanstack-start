import { useEffect, useState } from 'react'
import { FormProvider, useController, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImageIcon, UserIcon } from 'lucide-react'
import { updateImagesDefaultValues, updateImagesSchema } from './zod-schema'
import type { UpdateImagesSchema } from './zod-schema'
import type { MySeller } from '@/api/sellers/types'
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
import { useUpdateMySeller } from '@/api/sellers/queries'
import { UploadFileArea } from '@/components/custom/UploadFileArea'
import { useUploadToR2 } from '@/api/uploads/queries'
import { ImageCropper } from '@/components/custom/ImageCropper'

type UploadingType = 'avatar' | 'cover'

interface EditImagesProps {
  seller: MySeller | null | undefined
  open: boolean
  onOpen: (open: boolean) => void
}

export const EditImages = ({ seller, open, onOpen }: EditImagesProps) => {
  const methods = useForm<UpdateImagesSchema>({
    resolver: zodResolver(updateImagesSchema),
    defaultValues: updateImagesDefaultValues,
  })

  const { handleSubmit, reset, control } = methods

  const { field: avatarUrlField } = useController({
    control,
    name: 'avatarUrl',
  })

  const { field: coverImageUrlField } = useController({
    control,
    name: 'coverImageUrl',
  })

  const { mutate: updateImages, isPending } = useUpdateMySeller()

  const onSubmit = (data: UpdateImagesSchema) => {
    if (!seller) return

    updateImages(
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

  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(null)
  const [uploadingType, setUploadingType] = useState<UploadingType>('avatar')

  const { mutateAsync: uploadImage, isPending: isUploadingImage } =
    useUploadToR2()

  const handleChange = (file: File | Array<File>, imageType: UploadingType) => {
    const actualFile = Array.isArray(file) ? file[0] : file
    const fileWithPreview = Object.assign(actualFile, {
      preview: URL.createObjectURL(actualFile),
    })
    setSelectedFile(fileWithPreview)
    setUploadingType(imageType)
  }

  const onSave = async (image: string) => {
    const response = await fetch(image)
    const blob = await response.blob()
    const file = new File([blob], 'avatar.png', { type: blob.type })
    const result = await uploadImage({ file, folder: 'test' })
    if (uploadingType === 'avatar') {
      avatarUrlField.onChange(result.publicUrl)
    } else {
      coverImageUrlField.onChange(result.publicUrl)
    }
    setSelectedFile(null)
  }

  useEffect(() => {
    if (seller) {
      methods.reset(seller)
    }
  }, [seller])

  return (
    <>
      {selectedFile && (
        <ImageCropper
          dialogOpen={!!selectedFile}
          setDialogOpen={() => setSelectedFile(null)}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          onSave={onSave}
          aspectRatio={uploadingType === 'avatar' ? 1 : 5 / 1}
        />
      )}
      <Dialog open={open} onOpenChange={onOpen}>
        <DialogContent className="max-w-sm sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Slike</DialogTitle>
            <Separator />
          </DialogHeader>
          <FormProvider {...methods}>
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-5">
                <UploadFileArea
                  label="Logo"
                  Icon={UserIcon}
                  src={avatarUrlField.value}
                  onFileChange={(file) => handleChange(file, 'avatar')}
                  onClear={() => avatarUrlField.onChange(null)}
                  isUploading={uploadingType === 'avatar' && isUploadingImage}
                  footerText="Preporučena veličina: 600x600"
                />
                <UploadFileArea
                  label="Naslovna slika profila"
                  src={coverImageUrlField.value}
                  Icon={ImageIcon}
                  onFileChange={(file) => handleChange(file, 'cover')}
                  onClear={() => coverImageUrlField.onChange(null)}
                  isUploading={uploadingType === 'cover' && isUploadingImage}
                  footerText="Preporučena veličina: 1200x400"
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
