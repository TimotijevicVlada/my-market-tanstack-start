import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export interface PreviewImage {
  id: string
  url: string
  alt?: string | null
}

interface ImagePreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  images: Array<PreviewImage>
  initialIndex?: number
}

export const ImagePreviewModal = ({
  open,
  onOpenChange,
  images,
  initialIndex = 0,
}: ImagePreviewModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const length = images.length

  useEffect(() => {
    if (open) {
      setCurrentIndex((prev) =>
        initialIndex >= 0 && initialIndex < length ? initialIndex : prev,
      )
    }
  }, [open, initialIndex, length])

  if (length === 0) return null

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + length) % length)
  }
  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % length)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="!fixed !inset-0 z-50 h-screen w-screen !max-w-none !translate-x-0 !translate-y-0 border-0 bg-black/60 p-0 shadow-none outline-none sm:!max-w-none"
        showCloseButton={false}
      >
        <div className="absolute inset-0 overflow-hidden">
          {images.map((image, i) => (
            <div
              key={image.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                i === currentIndex
                  ? 'opacity-100'
                  : 'pointer-events-none opacity-0'
              }`}
            >
              <img
                src={image.url}
                alt={image.alt ?? `Slika proizvoda ${i + 1}`}
                className="size-full object-contain"
              />
            </div>
          ))}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-background/80 px-3 py-1.5 text-sm font-medium backdrop-blur-sm">
            {currentIndex + 1} / {length}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 size-10 -translate-y-1/2 rounded-full bg-background/30 backdrop-blur-sm hover:bg-background/50"
            onClick={goPrev}
            aria-label="Prethodna slika"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 size-10 -translate-y-1/2 rounded-full bg-background/30 backdrop-blur-sm hover:bg-background/50"
            onClick={goNext}
            aria-label="Sledeća slika"
          >
            <ChevronRight className="size-5" />
          </Button>

          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 size-10 rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
              aria-label="Zatvori"
            >
              <X className="size-5" />
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
