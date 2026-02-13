import { useCallback, useEffect, useState } from 'react'
import { LayoutDashboard, Plus } from 'lucide-react'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useNavigate } from '@tanstack/react-router'
import { SortableBannerRow } from '../SortableBannerRow'
import type { DragEndEvent } from '@dnd-kit/core'
import type { Banner, BannerPlacement } from '@/api/banners/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { SectionHead } from '@/components/custom/SectionHead'
import { EmptyData } from '@/components/custom/EmptyData'
import { AlertDialog } from '@/components/custom/AlertDialog'
import {
  useDeleteBanner,
  useGetBannersByPlacement,
  useUpdateBannerSortOrder,
} from '@/api/banners/queries'
import { Spinner } from '@/components/ui/spinner'

const placementLabels: Record<BannerPlacement, string> = {
  home: 'Pocetna strana',
  category: 'Stranica kategorije',
}

interface BannerListProps {
  filterPlacement: BannerPlacement
}

export const BannerList = ({ filterPlacement }: BannerListProps) => {
  const navigate = useNavigate()

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [banners, setBanners] = useState<Array<Banner>>([])

  const { mutate: updateBannerSortOrder } = useUpdateBannerSortOrder()
  const { mutate: deleteBanner, isPending: isDeleting } = useDeleteBanner()
  const { data: bannerList, isLoading } =
    useGetBannersByPlacement(filterPlacement)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return
      const oldIndex = banners.findIndex((b) => b.id === active.id)
      const newIndex = banners.findIndex((b) => b.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return
      const reordered = arrayMove(banners, oldIndex, newIndex)
      setBanners(reordered)
      updateBannerSortOrder({
        data: reordered.map((b, i) => ({ id: b.id, sortOrder: i + 1 })),
      })
    },
    [banners, updateBannerSortOrder],
  )

  const handleDelete = (id: string) => {
    deleteBanner(
      { data: { id } },
      {
        onSuccess: () => {
          setDeleteId(null)
        },
      },
    )
  }

  useEffect(() => {
    if (bannerList) setBanners(bannerList)
  }, [bannerList])

  return (
    <>
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <SectionHead
            Icon={LayoutDashboard}
            title="Lista banera"
            description="Prevucite banere da biste promenili redosled prikazivanja"
          />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 h-[10rem]">
              <Spinner className="w-6 h-6" />
              <span className="text-lg">Učitavanje...</span>
            </div>
          ) : banners.length === 0 ? (
            <EmptyData
              title="Nema banera"
              description={`Nemate banere za poziciju "${placementLabels[filterPlacement]}".`}
              button={{
                text: 'Kreiraj baner',
                icon: <Plus />,
                onClick: () => navigate({ to: '/admin/banners/create' }),
              }}
            />
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={banners.map((b) => b.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {banners.map((banner) => (
                    <SortableBannerRow
                      key={banner.id}
                      banner={banner}
                      onDelete={(id) => setDeleteId(id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>
      <AlertDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Obriši baner"
        description="Da li ste sigurni da želite da obrišete ovaj baner?"
        onConfirm={() => handleDelete(deleteId!)}
        onCancel={() => setDeleteId(null)}
        confirmText="Obriši"
        loading={{ state: isDeleting, text: 'Brisanje...' }}
      />
    </>
  )
}
