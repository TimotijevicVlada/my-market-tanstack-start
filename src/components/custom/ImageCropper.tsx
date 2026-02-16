import React from 'react'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import { CropIcon, Trash2Icon } from 'lucide-react'
import type { SyntheticEvent } from 'react'
import type { FileWithPath } from 'react-dropzone'
import type { Crop, PixelCrop } from 'react-image-crop'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import 'react-image-crop/dist/ReactCrop.css'

export type FileWithPreview = FileWithPath & {
  preview: string
}

interface ImageCropperProps {
  dialogOpen: boolean
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedFile: FileWithPreview | null
  setSelectedFile: React.Dispatch<React.SetStateAction<FileWithPreview | null>>
  aspectRatio?: number
  onSave: (image: string) => void
}

export function ImageCropper({
  dialogOpen,
  setDialogOpen,
  selectedFile,
  setSelectedFile,
  aspectRatio = 1,
  onSave,
}: ImageCropperProps) {
  const imgRef = React.useRef<HTMLImageElement | null>(null)

  const [crop, setCrop] = React.useState<Crop>()
  const [croppedImageUrl, setCroppedImageUrl] = React.useState<string>('')

  const onImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, aspectRatio))
  }

  const onCropComplete = (cropTemp: PixelCrop) => {
    if (imgRef.current && cropTemp.width && cropTemp.height) {
      const croppedImageUrlTemp = getCroppedImg(imgRef.current, cropTemp)
      setCroppedImageUrl(croppedImageUrlTemp)
    }
  }

  const getCroppedImg = (
    image: HTMLImageElement,
    cropTemp: PixelCrop,
  ): string => {
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    canvas.width = cropTemp.width * scaleX
    canvas.height = cropTemp.height * scaleY

    const ctx = canvas.getContext('2d')

    if (ctx) {
      ctx.imageSmoothingEnabled = false

      ctx.drawImage(
        image,
        cropTemp.x * scaleX,
        cropTemp.y * scaleY,
        cropTemp.width * scaleX,
        cropTemp.height * scaleY,
        0,
        0,
        cropTemp.width * scaleX,
        cropTemp.height * scaleY,
      )
    }

    return canvas.toDataURL('image/png', 1.0)
  }

  const onCrop = () => {
    try {
      setDialogOpen(false)
      onSave(croppedImageUrl)
    } catch (error) {
      alert('Something went wrong!')
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <span className="sr-only" aria-hidden />
      </DialogTrigger>
      <DialogContent className="p-0 gap-0">
        <div className="p-6 size-full">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => onCropComplete(c)}
            aspect={aspectRatio}
            className="w-full"
          >
            <img
              ref={imgRef}
              src={selectedFile?.preview}
              alt="Crop"
              onLoad={onImageLoad}
              className="max-h-[70vh] max-w-full w-auto h-auto object-contain block mx-auto"
            />
          </ReactCrop>
        </div>
        <DialogFooter className="p-6 pt-0 justify-center ">
          <DialogClose asChild>
            <Button
              size={'sm'}
              type="reset"
              className="w-fit"
              variant={'outline'}
              onClick={() => {
                setSelectedFile(null)
              }}
            >
              <Trash2Icon className="mr-1.5 size-4" />
              Poništi
            </Button>
          </DialogClose>
          <Button type="submit" size={'sm'} className="w-fit" onClick={onCrop}>
            <CropIcon className="mr-1.5 size-4" />
            Sačuvaj
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Helper function to center the crop
export function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 50,
        height: 50,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}
