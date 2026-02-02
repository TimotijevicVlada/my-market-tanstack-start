import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVerticalIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/custom/Button'

interface SortableImageProps {
  id: string
  index: number
  onRemove: () => void
}

export const SortableImage = ({ id, index, onRemove }: SortableImageProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`aspect-square overflow-hidden rounded-lg relative ${
        isDragging ? 'opacity-50 z-50' : ''
      }`}
    >
      <img
        src={id}
        alt={`Product image ${index + 1}`}
        className="w-full h-full object-cover"
      />
      <Button
        variant="secondary"
        size="icon-sm"
        type="button"
        className="absolute top-2 left-2 gap-2 rounded-full cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVerticalIcon className="size-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon-sm"
        type="button"
        className="absolute bottom-2 left-2 gap-2 rounded-full"
        onClick={onRemove}
      >
        <Trash2Icon className="size-4 text-red-500" />
      </Button>
    </div>
  )
}
