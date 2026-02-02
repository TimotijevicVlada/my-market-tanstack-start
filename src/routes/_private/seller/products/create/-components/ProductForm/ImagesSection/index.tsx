import { useState } from 'react'
import { ImageIcon, ImagePlusIcon, Trash2Icon } from 'lucide-react'
import { useController, useFormContext } from 'react-hook-form'
import { FileUploader } from 'react-drag-drop-files'
import { toast } from 'sonner'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { SortableImage } from './SortableImage'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import type { ProductFormSchema } from '../zod-schema'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/custom/Button'
import { useUploadToR2 } from '@/api/uploads/queries'
import { Spinner } from '@/components/ui/spinner'

const FILE_TYPES = ['JPG', 'JPEG', 'PNG', 'JFIF', 'WEBP', 'AVIF']

export const ImagesSection = () => {
  const { control } = useFormContext<ProductFormSchema>()
  const [activeId, setActiveId] = useState<string | null>(null)

  const {
    field: { value, onChange },
  } = useController({
    name: 'images',
    control,
  })

  const { mutateAsync: uploadImage, isPending } = useUploadToR2()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (over && active.id !== over.id) {
      const oldIndex = value.indexOf(active.id as string)
      const newIndex = value.indexOf(over.id as string)
      onChange(arrayMove(value, oldIndex, newIndex))
    }
  }

  const handleChange = async (file: File | Array<File>) => {
    let files: Array<File> = []

    if (Array.isArray(file)) {
      files = file
    }
    if (file instanceof FileList) {
      files = Array.from(file)
    }
    if (file instanceof File) {
      files = [file]
    }

    const results = await Promise.all(
      files.map((f) => uploadImage({ file: f, folder: 'test' })),
    )

    onChange([...value, ...results.map((r) => r.publicUrl)])
  }

  const UploaderIcon = isPending ? Spinner : ImagePlusIcon

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <ImageIcon className="size-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Slike proizvoda</CardTitle>
              <CardDescription>
                Dodajte fotografije vašeg proizvoda
              </CardDescription>
            </div>
          </div>
          {value.length > 0 && (
            <Button
              variant="destructive"
              type="button"
              onClick={() => onChange([])}
            >
              <Trash2Icon className="size-4" />
              Ukloni sve slike
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {value.length} / 8 slika
        </p>
        {value.length === 0 && (
          <FileUploader
            types={FILE_TYPES}
            onTypeError={() => toast.error('Tip datoteke nije podržan')}
            hoverTitle="Ovde otpustite datoteku"
            handleChange={handleChange}
            multiple
          >
            <div className="rounded-lg border border-dashed border-border py-12 text-center border-2 hover:border-primary/50 hover:bg-primary/5 transition-all">
              <ImageIcon className="mx-auto size-10 text-muted-foreground" />
              <p className="mt-3 font-medium">Nema dodatih slika</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Kliknite "Dodaj sliku" da dodate fotografije proizvoda
              </p>
              <Button
                variant="outline"
                type="button"
                className="mt-4 gap-2 bg-transparent"
              >
                <UploaderIcon className="size-4" />
                Dodaj prvu sliku
              </Button>
            </div>
          </FileUploader>
        )}

        {value.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={value} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6 mt-4">
                {value.map((image, index) => (
                  <SortableImage
                    key={image}
                    id={image}
                    index={index}
                    onRemove={() => onChange(value.filter((i) => i !== image))}
                  />
                ))}
                {value.length < 8 && (
                  <div className="w-full aspect-square">
                    <FileUploader
                      types={FILE_TYPES}
                      onTypeError={() =>
                        toast.error('Tip datoteke nije podržan')
                      }
                      hoverTitle="Ovde otpustite datoteku"
                      handleChange={handleChange}
                      multiple
                    >
                      <div className="rounded-lg border border-dashed border-border text-center w-full h-full flex flex-col items-center justify-center border-2 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <UploaderIcon className="text-muted-foreground" />
                        <p className="mt-2 text-sm">Dodajte još slika</p>
                      </div>
                    </FileUploader>
                  </div>
                )}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeId ? (
                <div className="aspect-square overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={activeId}
                    alt="Dragging"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </CardContent>
    </Card>
  )
}
