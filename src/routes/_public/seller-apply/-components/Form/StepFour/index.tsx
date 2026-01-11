import { useState } from 'react'
import { ChevronLeft, ImageIcon, UserIcon } from 'lucide-react'
import { useController } from 'react-hook-form'
import type { Dispatch, SetStateAction } from 'react'
import type { FourthStepSchema } from './step-four-schema'
import type { UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/custom/Button'
import { SectionHead } from '@/components/custom/SectionHead'
import { UploadFileArea } from '@/components/custom/UploadFileArea'
import { getImageUrl } from '@/utils/get-image-url'
import { useUploadToR2 } from '@/api/uploads/queries'
import { DialogFooter } from '@/components/ui/dialog'

type UploadingType = 'avatar' | 'cover'

interface StepFourProps {
  setActiveStep: Dispatch<SetStateAction<number>>
  fourthStepMethods: UseFormReturn<FourthStepSchema>
  onFourthStepSubmit: (formValues: FourthStepSchema) => void
  isSubmitting: boolean
}

export const StepFour = ({
  setActiveStep,
  fourthStepMethods,
  onFourthStepSubmit,
  isSubmitting,
}: StepFourProps) => {
  const { control, handleSubmit, reset } = fourthStepMethods

  const { field: avatarUrlField } = useController({
    control,
    name: 'avatarUrl',
  })

  const { field: coverImageUrlField } = useController({
    control,
    name: 'coverImageUrl',
  })

  const [uploadingType, setUploadingType] = useState<UploadingType>('avatar')

  const { mutate: uploadImage, isPending: isUploadingImage } = useUploadToR2()

  const onChange = (file: File | null, imageType: UploadingType) => {
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
    <form onSubmit={handleSubmit(onFourthStepSubmit)} className="space-y-6">
      <SectionHead
        Icon={ImageIcon}
        title="Slike"
        description="Dodajte logo i naslovnu sliku"
        className="pb-2"
      />

      <div className="flex gap-4">
        <div className="flex-1">
          <UploadFileArea
            label="Logo"
            Icon={UserIcon}
            src={getImageUrl(avatarUrlField.value)}
            onFileChange={(file) => onChange(file, 'avatar')}
            onClear={() => avatarUrlField.onChange(null)}
            isUploading={uploadingType === 'avatar' && isUploadingImage}
            footerText="Preporučena veličina: 600x600"
          />
        </div>
        <div className="flex-1">
          <UploadFileArea
            label="Naslovna slika profila"
            src={getImageUrl(coverImageUrlField.value)}
            Icon={ImageIcon}
            onFileChange={(file) => onChange(file, 'cover')}
            onClear={() => coverImageUrlField.onChange(null)}
            isUploading={uploadingType === 'cover' && isUploadingImage}
            footerText="Preporučena veličina: 1200x400"
          />
        </div>
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
              text: 'Čuvanje...',
            }}
          >
            Sačuvaj
          </Button>
        </div>
      </DialogFooter>
    </form>
  )
}
