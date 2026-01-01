import {
  TooltipContent,
  TooltipTrigger,
  Tooltip as TooltipUI,
} from '@/components/ui/tooltip'

interface TooltipProps {
  children: React.ReactNode
  title: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  disabled?: boolean
}

export const Tooltip = ({
  children,
  title,
  side = 'bottom',
  disabled,
}: TooltipProps) => {
  if (disabled) {
    return children
  }

  return (
    <TooltipUI>
      <TooltipTrigger asChild disabled={disabled}>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side}>
        <p>{title}</p>
      </TooltipContent>
    </TooltipUI>
  )
}
