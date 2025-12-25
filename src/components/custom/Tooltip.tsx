import {
  TooltipContent,
  TooltipTrigger,
  Tooltip as TooltipUI,
} from '@/components/ui/tooltip'

interface TooltipProps {
  children: React.ReactNode
  title: string
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export const Tooltip = ({ children, title, side = 'bottom' }: TooltipProps) => {
  return (
    <TooltipUI>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>
        <p>{title}</p>
      </TooltipContent>
    </TooltipUI>
  )
}
