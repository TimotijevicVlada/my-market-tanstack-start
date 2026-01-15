import { Pencil } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

interface SectionHeadProps {
  Icon: React.ElementType
  title: string
  description: string
  className?: string
  onEdit?: () => void
}

export const SectionHead = ({
  Icon,
  title,
  description,
  className,
  onEdit,
}: SectionHeadProps) => {
  return (
    <div className="flex items-start justify-between">
      <div className={cn('flex items-center gap-3', className)}>
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="size-5 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {onEdit && (
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Pencil />
        </Button>
      )}
    </div>
  )
}
