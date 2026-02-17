import { Link } from '@tanstack/react-router'
import { ChevronLeftIcon } from 'lucide-react'
import { Button } from '../ui/button'
import type { FileRouteTypes } from '@/routeTree.gen'

interface BackLinkHeadProps {
  path: FileRouteTypes['to']
  title: string
  description: string
}

export const BackLinkHead = ({
  path,
  title,
  description,
}: BackLinkHeadProps) => {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="secondary"
        size="icon"
        type="button"
        className="size-10 rounded-lg"
        asChild
      >
        <Link to={path}>
          <ChevronLeftIcon className="size-5" />
        </Link>
      </Button>
      <div>
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
