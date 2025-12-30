import { FolderIcon } from 'lucide-react'
import { Button } from './Button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

interface EmptyDataProps {
  title: string
  description?: string
  button?: {
    text: string
    icon?: React.ReactNode
    onClick?: () => void
  }
}

export const EmptyData = ({ title, description, button }: EmptyDataProps) => {
  const { text, icon, onClick } = button ?? {}

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderIcon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      <EmptyContent>
        {button && (
          <Button onClick={onClick}>
            {icon} {text}
          </Button>
        )}
      </EmptyContent>
    </Empty>
  )
}
