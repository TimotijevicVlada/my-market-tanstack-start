import { cn } from '@/lib/utils'

interface SectionHeadProps {
  Icon: React.ElementType
  title: string
  description: string
  className?: string
}

export const SectionHead = ({
  Icon,
  title,
  description,
  className,
}: SectionHeadProps) => {
  return (
    <div className={cn('flex items-center gap-3 pb-2', className)}>
      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="size-5 text-primary" />
      </div>
      <div>
        <h2 className="font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
