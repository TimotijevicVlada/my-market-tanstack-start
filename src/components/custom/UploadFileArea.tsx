import { Trash2Icon } from 'lucide-react'
import { FileUploader } from 'react-drag-drop-files'
import { toast } from 'sonner'
import { Spinner } from '../ui/spinner'
import { Button } from './Button'
import type { ElementType } from 'react'
import { cn } from '@/lib/utils'

const FILE_TYPES = ['JPG', 'JPEG', 'PNG', 'JFIF', 'WEBP', 'AVIF']

interface UploadFileAreaProps {
  src: string | null | undefined
  onFileChange: (file: File) => void
  onClear: () => void
  Icon: ElementType
  label?: string
  isUploading?: boolean
  containerProps?: React.HTMLAttributes<HTMLDivElement>
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>
  labelProps?: React.LabelHTMLAttributes<HTMLParagraphElement>
  fileUploaderProps?: React.ComponentProps<typeof FileUploader>
  uploadContainerProps?: React.HTMLAttributes<HTMLDivElement>
  clearButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>
  fileTypes?: Array<string>
}

export const UploadFileArea = ({
  label,
  src,
  onFileChange,
  onClear,
  Icon,
  isUploading,
  containerProps,
  imgProps,
  labelProps,
  fileUploaderProps,
  uploadContainerProps,
  clearButtonProps,
  fileTypes = FILE_TYPES,
}: UploadFileAreaProps) => {
  const handleChange = (file: File | Array<File>) => {
    if (!Array.isArray(file)) {
      onFileChange(file)
    }
  }

  const UploaderIcon = isUploading ? Spinner : Icon

  return (
    <div {...containerProps} className={cn('w-fit', containerProps?.className)}>
      {src ? (
        <img
          {...imgProps}
          src={src}
          alt={label}
          className={cn(
            'w-26 h-26 rounded-md object-cover bg-muted-foreground/20',
            imgProps?.className,
          )}
        />
      ) : (
        <FileUploader
          {...fileUploaderProps}
          types={fileTypes}
          onTypeError={() => toast.error('Tip datoteke nije podržan')}
          hoverTitle="Ovde otpustite datoteku"
          handleChange={handleChange}
        >
          <div
            {...uploadContainerProps}
            className={cn(
              'w-26 h-26 border border-dashed border-muted-foreground hover:bg-muted-foreground/10 rounded-md flex items-center justify-center',
              uploadContainerProps?.className,
            )}
          >
            <UploaderIcon className="w-6 h-6 text-muted-foreground" />
          </div>
        </FileUploader>
      )}
      {label && (
        <p
          {...labelProps}
          className={cn(
            'text-sm text-muted-foreground text-center mt-2',
            labelProps?.className,
          )}
        >
          {label}
        </p>
      )}
      {src && (
        <div className="flex">
          <Button
            {...clearButtonProps}
            variant="ghost"
            size="sm"
            className={cn(
              'text-xs text-red-500 text-center mt-2 hover:text-red-500',
              clearButtonProps?.className,
            )}
            onClick={onClear}
          >
            <Trash2Icon className="w-4 h-4" />
            Obriši sliku
          </Button>
        </div>
      )}
    </div>
  )
}
