import { useState } from 'react'
import { ChevronLeft, ImageIcon, UserIcon } from 'lucide-react'
import { useController } from 'react-hook-form'
import type { FourthStepSchema } from './zod-schema-step-four'
import type { UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/custom/Button'
import { DialogFooter } from '@/components/ui/dialog'
import { useUploadToR2 } from '@/api/uploads/queries'
import { UploadFileArea } from '@/components/custom/UploadFileArea'
import { getImageUrl } from '@/utils/get-image-url'

interface StepFourProps {
  setActiveStep: (step: number) => void
  isSubmitting: boolean
  type: 'create' | 'edit'
  fourthStepMethods: UseFormReturn<FourthStepSchema>
  onFourthStepSubmit: (formValues: FourthStepSchema) => void
}

export const StepFour = ({
  setActiveStep,
  isSubmitting,
  type,
  fourthStepMethods,
  onFourthStepSubmit,
}: StepFourProps) => {
  const { handleSubmit, control, reset } = fourthStepMethods

  const [uploadingType, setUploadingType] = useState<'avatar' | 'cover'>(
    'avatar',
  )

  const { field: avatarUrlField } = useController({
    control,
    name: 'avatarUrl',
  })

  const { field: coverImageUrlField } = useController({
    control,
    name: 'coverImageUrl',
  })

  const { mutate: uploadImage, isPending: isUploadingImage } = useUploadToR2()

  const onChange = (file: File | null, imageType: 'avatar' | 'cover') => {
    if (!file) return

    setUploadingType(imageType)

    uploadImage(
      { file, folder: 'test' },
      {
        onSuccess: (data) => {
          if (imageType === 'avatar') {
            avatarUrlField.onChange(data.key)
          } else {
            coverImageUrlField.onChange(data.key)
          }
        },
      },
    )
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(onFourthStepSubmit)}
    >
      <div className="py-4 flex gap-4">
        <UploadFileArea
          label="Logo"
          Icon={UserIcon}
          src={getImageUrl(avatarUrlField.value)}
          onFileChange={(file) => onChange(file, 'avatar')}
          onClear={() => avatarUrlField.onChange(null)}
          isUploading={uploadingType === 'avatar' && isUploadingImage}
          imgProps={{
            className: 'rounded-full',
          }}
          uploadContainerProps={{
            className: 'rounded-full',
          }}
          clearButtonProps={{
            className: 'mx-auto',
          }}
        />
        <UploadFileArea
          label="Naslovna slika profila"
          src={getImageUrl(coverImageUrlField.value)}
          Icon={ImageIcon}
          onFileChange={(file) => onChange(file, 'cover')}
          onClear={() => coverImageUrlField.onChange(null)}
          isUploading={uploadingType === 'cover' && isUploadingImage}
          containerProps={{
            className: 'flex-1',
          }}
          imgProps={{
            className: 'w-full',
          }}
          uploadContainerProps={{
            className: 'w-full',
          }}
          clearButtonProps={{
            className: 'mx-auto',
          }}
        />
      </div>
      <DialogFooter className="flex justify-between!">
        <Button variant="ghost" onClick={() => setActiveStep(3)}>
          <ChevronLeft />
          Nazad
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" type="button" onClick={() => reset()}>
            Poništi
          </Button>
          <Button
            type="submit"
            loading={{
              state: isSubmitting,
              text: type === 'create' ? 'Kreiranje...' : 'Izmena...',
            }}
          >
            {type === 'create' ? 'Sacuvaj' : 'Izmeni'}
          </Button>
        </div>
      </DialogFooter>
    </form>
  )
}
