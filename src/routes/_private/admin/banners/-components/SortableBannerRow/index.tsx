import {
  ExternalLink,
  Eye,
  EyeOff,
  GripVertical,
  ImageIcon,
  Monitor,
  MousePointerClick,
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
import { Badge } from '@/components/ui/badge'
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
    transition,
  }

  const PlacementIcon = placementIcons[banner.placement]

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-4 rounded-xl border border-border/50 bg-card p-4 transition-all ${
        isDragging
          ? 'z-50 scale-[1.02] shadow-xl shadow-primary/10 ring-2 ring-primary/30'
          : 'hover:border-border'
      } ${!banner.isActive ? 'opacity-60' : ''}`}
    >
      {/* Drag Handle */}
      <button
        className="flex-shrink-0 cursor-grab touch-none rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:cursor-grabbing"
        {...attributes}
        {...listeners}
        aria-label="Prevuci za promenu redosleda"
      >
        <GripVertical className="size-5" />
      </button>

      {/* Banner Image Thumbnail */}
      <div className="relative size-16 flex-shrink-0 overflow-hidden rounded-lg border border-border/50 bg-muted md:h-20 md:w-32">
        {banner.imageUrl ? (
          <img
            src={banner.imageUrl}
            alt={banner.altText || banner.title}
            className="size-full object-cover"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <ImageIcon className="size-6 text-muted-foreground" />
          </div>
        )}
        {!banner.isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <EyeOff className="size-4 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Banner Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-semibold">{banner.title}</h3>
          <Badge
            variant="outline"
            className={`flex-shrink-0 gap-1 text-xs ${
              banner.isActive
                ? 'border-green-500/30 bg-green-500/10 text-green-500'
                : 'border-muted-foreground/30 bg-muted text-muted-foreground'
            }`}
          >
            {banner.isActive ? (
              <>
                <Eye className="size-3" />
                Aktivno
              </>
            ) : (
              <>
                <EyeOff className="size-3" />
                Neaktivno
              </>
            )}
          </Badge>
        </div>
        {banner.subtitle && (
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {banner.subtitle}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="gap-1 text-xs">
            <PlacementIcon className="size-3" />
            {placementLabels[banner.placement]}
          </Badge>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MousePointerClick className="size-3" />
            {banner.ctaLabel}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <ExternalLink className="size-3" />
            <span className="max-w-[120px] truncate">{banner.ctaHref}</span>
          </span>
        </div>
      </div>

      <div className="flex flex-shrink-0 items-center gap-2">
        <Switch
          checked={banner.isActive}
          onCheckedChange={() =>
            toggleBannerActive({ data: { id: banner.id } })
          }
          aria-label={banner.isActive ? 'Deaktiviraj' : 'Aktiviraj'}
        />
        <Tooltip title="Izmeni baner">
          <Button
            variant="ghost"
            size="icon"
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
            size="icon"
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
