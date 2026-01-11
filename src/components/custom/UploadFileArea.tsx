import { Trash2Icon } from 'lucide-react'
import { FileUploader } from 'react-drag-drop-files'
import { toast } from 'sonner'
import { Spinner } from '../ui/spinner'
import { Label } from '../ui/label'
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
  fileTypes?: Array<string>
  footerText?: string
}

export const UploadFileArea = ({
  label,
  src,
  onFileChange,
  onClear,
  Icon,
  isUploading,
  fileTypes = FILE_TYPES,
  footerText,
}: UploadFileAreaProps) => {
  const handleChange = (file: File | Array<File>) => {
    if (!Array.isArray(file)) {
      onFileChange(file)
    }
  }

  const UploaderIcon = isUploading ? Spinner : Icon

  return (
    <div>
      {label && <Label className="mb-2">{label}</Label>}
      {src ? (
        <div className="w-full h-45 rounded-md border-2 border-border relative">
          <img
            src={src}
            alt={label}
            className={cn('w-full h-full object-contain')}
          />
          <Button
            size="icon-sm"
            className="absolute top-2 right-2 gap-2 rounded-full"
            onClick={onClear}
          >
            <Trash2Icon />
          </Button>
        </div>
      ) : (
        <div>
          <FileUploader
            types={fileTypes}
            onTypeError={() => toast.error('Tip datoteke nije podržan')}
            hoverTitle="Ovde otpustite datoteku"
            handleChange={handleChange}
          >
            <div
              className={cn(
                'h-45 group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all border-border hover:border-primary/50 hover:bg-primary/5',
              )}
            >
              <div className="flex size-16 items-center justify-center rounded-lg bg-muted-foreground/10">
                <UploaderIcon />
              </div>
              <p className="mt-3 text-sm font-medium">Prevucite sliku ovde</p>
              <p className="text-xs text-muted-foreground">
                ili kliknite da izaberete
              </p>
            </div>
          </FileUploader>
          {footerText && (
            <p className="text-xs text-muted-foreground mt-2">{footerText}</p>
          )}
        </div>
      )}
    </div>
  )
}
