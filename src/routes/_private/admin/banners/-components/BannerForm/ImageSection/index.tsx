import { useState } from 'react'
import { ArrowRight, ImageIcon, ImagePlusIcon, XIcon } from 'lucide-react'
import { FileUploader } from 'react-drag-drop-files'
import { toast } from 'sonner'
import { useController, useFormContext, useWatch } from 'react-hook-form'
import type { BannerFormSchema } from '../zod-schema'
import type { FileWithPreview } from '@/components/custom/ImageCropper'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { useUploadToR2 } from '@/api/uploads/queries'
import { Button } from '@/components/custom/Button'
import { SectionHead } from '@/components/custom/SectionHead'
import { ImageCropper } from '@/components/custom/ImageCropper'

const FILE_TYPES = ['JPG', 'JPEG', 'PNG', 'JFIF', 'WEBP', 'AVIF']

export const ImageSection = () => {
  const { control } = useFormContext<BannerFormSchema>()

  const { field } = useController({
    name: 'imageUrl',
    control,
  })

  const title = useWatch({ control, name: 'title' })
  const subtitle = useWatch({ control, name: 'subtitle' })
  const ctaLabel = useWatch({ control, name: 'ctaLabel' })

  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(null)

  const { mutateAsync: uploadImage, isPending } = useUploadToR2()

  const handleChange = (file: File | Array<File>) => {
    const actualFile = Array.isArray(file) ? file[0] : file
    const fileWithPreview = Object.assign(actualFile, {
      preview: URL.createObjectURL(actualFile),
    })
    setSelectedFile(fileWithPreview)
  }

  const onSave = async (image: string) => {
    const response = await fetch(image)
    const blob = await response.blob()
    const file = new File([blob], 'banner.png', { type: blob.type })
    const result = await uploadImage({ file, folder: 'test' })
    field.onChange(result.publicUrl)
    setSelectedFile(null)
  }

  const UploaderIcon = isPending ? Spinner : ImagePlusIcon

  return (
    <Card>
      {selectedFile && (
        <ImageCropper
          aspectRatio={5 / 1}
          dialogOpen={!!selectedFile}
          setDialogOpen={() => setSelectedFile(null)}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          onSave={onSave}
        />
      )}
      <CardHeader className="pb-4">
        <SectionHead
          Icon={ImageIcon}
          title="Slika banera"
          description="Pozadinska slika banera - preporucena velicina 1920x600px"
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-full aspect-[5/1]">
          {field.value ? (
            <div className="w-full h-full relative rounded-lg overflow-hidden">
              <img
                src={field.value}
                alt="Banner"
                className="w-full h-full object-cover"
              />
              <Button
                size="icon-sm"
                variant="secondary"
                className="absolute top-2 right-2 rounded-full z-1"
                onClick={() => field.onChange('')}
              >
                <XIcon />
              </Button>
              {/* {Image overlay gradient for better text visibility} */}
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-start gap-3">
                {title && <h1>{title}</h1>}
                {subtitle && <p>{subtitle}</p>}
                {ctaLabel && (
                  <Button size="sm" type="button">
                    {ctaLabel} <ArrowRight className="size-4" />
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <FileUploader
              types={FILE_TYPES}
              onTypeError={() => toast.error('Tip datoteke nije podržan')}
              hoverTitle="Ovde otpustite datoteku"
              handleChange={handleChange}
            >
              <div className="rounded-lg border border-dashed border-border text-center w-full h-full flex flex-col items-center justify-center border-2 hover:border-primary/50 hover:bg-primary/5 transition-all">
                <div className="w-12 h-12 rounded-md bg-muted-foreground/10 flex items-center justify-center">
                  <UploaderIcon className="text-muted-foreground" />
                </div>
                <p className="mt-2">Dodajte sliku banera</p>
              </div>
            </FileUploader>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
