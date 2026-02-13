import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { BannerList } from './-components/BannerList'
import { BannerToolbar } from './-components/BannerToolbar'
import type { BannerPlacement } from '@/api/banners/types'

export const Route = createFileRoute('/_private/admin/banners/')({
  component: AdminBannerManager,
})

export function AdminBannerManager() {
  const [filterPlacement, setFilterPlacement] =
    useState<BannerPlacement>('home')

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-5">
        <h1 className="text-3xl font-bold tracking-tight">
          Upravljanje banerima
        </h1>
        <p className="mt-1 text-muted-foreground">
          Kreirajte, uredite i organizujte promotivne banere za vasu platformu
        </p>
      </div>

      <BannerToolbar
        filterPlacement={filterPlacement}
        setFilterPlacement={setFilterPlacement}
      />

      <BannerList filterPlacement={filterPlacement} />
    </div>
  )
}
