import {
  ArrowRight,
  ExternalLink,
  EyeOff,
  GripVertical,
  Monitor,
  Pencil,
  Tag,
  Trash2,
} from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Link } from '@tanstack/react-router'
import type { Banner, BannerPlacement } from '@/api/banners/types'
import type { ElementType } from 'react'
import { useToggleBannerActive } from '@/api/banners/queries'
import { Switch } from '@/components/ui/switch'
import { Tooltip } from '@/components/custom/Tooltip'
import { Button } from '@/components/custom/Button'

interface SortableBannerRowProps {
  banner: Banner
  onDelete: (id: string) => void
}

export const SortableBannerRow = ({
  banner,
  onDelete,
}: SortableBannerRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: banner.id,
  })

  const { mutate: toggleBannerActive } = useToggleBannerActive()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? transition : 'none',
  }

  const PlacementIcon = placementIcons[banner.placement]

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex gap-4 rounded-xl border border-border/50 bg-card p-4 ${
        isDragging
          ? 'z-50 scale-[1.02] shadow-xl shadow-primary/10 ring-2 ring-primary/30'
          : 'hover:border-border'
      } ${!banner.isActive ? 'opacity-60' : ''}`}
    >
      {/* Drag Handle */}
      <div className="flex items-center">
        <button
          className="flex-shrink-0 cursor-grab touch-none rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:cursor-grabbing"
          {...attributes}
          {...listeners}
          aria-label="Prevuci za promenu redosleda"
        >
          <GripVertical className="size-5" />
        </button>
      </div>

      {/* Banner Image Thumbnail */}
      <div className="relative flex-shrink-0 overflow-hidden rounded-md border border-border/50 bg-muted h-25 aspect-[5/1]">
        <img
          src={banner.imageUrl}
          alt={banner.altText || banner.title}
          className="size-full"
          crossOrigin="anonymous"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col items-start gap-1">
          <h4 className="font-semibold leading-none">{banner.title}</h4>
          <p className="text-xs">{banner.subtitle}</p>
          <Button className="h-6 text-xs rounded-sm !px-2">
            {banner.ctaLabel}
            <ArrowRight className="size-3" />
          </Button>
        </div>
        {!banner.isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <EyeOff className="size-4 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Banner Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <PlacementIcon className="size-3" />
          <span className="text-xs">{placementLabels[banner.placement]}</span>
        </div>
        <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <ExternalLink className="size-3" />
          <span className="line-clamp-1">{banner.ctaHref}</span>
        </p>
      </div>

      <div className="flex flex-col flex-shrink-0 items-center gap-2">
        <Switch
          size="sm"
          checked={banner.isActive}
          onCheckedChange={() =>
            toggleBannerActive({ data: { id: banner.id } })
          }
          aria-label={banner.isActive ? 'Deaktiviraj' : 'Aktiviraj'}
        />
        <Tooltip title="Izmeni baner">
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-9 text-muted-foreground hover:text-foreground"
          >
            <Link
              to={`/admin/banners/edit/$bannerId`}
              params={{ bannerId: banner.id }}
            >
              <Pencil className="text-orange-500" />
            </Link>
          </Button>
        </Tooltip>
        <Tooltip title="Obriši baner">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(banner.id)}
          >
            <Trash2 className="text-red-500" />
          </Button>
        </Tooltip>
      </div>
    </div>
  )
}

const placementIcons: Record<BannerPlacement, ElementType> = {
  home: Monitor,
  category: Tag,
}

const placementLabels: Record<BannerPlacement, string> = {
  home: 'Pocetna strana',
  category: 'Stranica kategorije',
}
