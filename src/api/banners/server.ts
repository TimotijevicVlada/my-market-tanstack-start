import { createServerFn } from '@tanstack/react-start'
import { asc, eq } from 'drizzle-orm'
import type { BannerPlacement } from './types'
import type { BannerFormSchema } from '@/routes/_private/admin/banners/-components/BannerForm/zod-schema'
import { requireAdminMiddleware } from '@/lib/middleware'
import { db } from '@/db'
import { banners } from '@/db/schema/banners'

export const createBanner = createServerFn({
  method: 'POST',
})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: BannerFormSchema) => data)
  .handler(async ({ data }) => {
    const [banner] = await db.insert(banners).values(data).returning()
    return banner
  })

export const getBannersByPlacement = createServerFn({
  method: 'GET',
})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: { placement: BannerPlacement }) => data)
  .handler(async ({ data }) => {
    const bannerList = await db.query.banners.findMany({
      where: (bannersTable) => eq(bannersTable.placement, data.placement),
      orderBy: (bannersTable) => [asc(bannersTable.sortOrder)],
    })
    return bannerList
  })

export const getBannerById = createServerFn({
  method: 'GET',
})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const banner = await db.query.banners.findFirst({
      where: (bannersTable) => eq(bannersTable.id, data.id),
    })
    return banner
  })

export const updateBanner = createServerFn({
  method: 'POST',
})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: BannerFormSchema & { bannerId: string }) => data)
  .handler(async ({ data }) => {
    const { bannerId, ...bannerData } = data

    const [updatedBanner] = await db
      .update(banners)
      .set(bannerData)
      .where(eq(banners.id, bannerId))
      .returning()

    return updatedBanner
  })

export const deleteBanner = createServerFn({
  method: 'POST',
})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await db.delete(banners).where(eq(banners.id, data.id))
    return { success: true }
  })

export const toggleBannerActive = createServerFn({
  method: 'POST',
})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const banner = await db.query.banners.findFirst({
      where: (bannersTable) => eq(bannersTable.id, data.id),
    })
    if (!banner) {
      return { success: false }
    }
    await db
      .update(banners)
      .set({ isActive: !banner.isActive })
      .where(eq(banners.id, data.id))
    return { success: true }
  })

export const updateBannerSortOrder = createServerFn({
  method: 'POST',
})
  .middleware([requireAdminMiddleware])
  .inputValidator((data: Array<{ id: string; sortOrder: number }>) => data)
  .handler(async ({ data }) => {
    console.log(data)
    await db.transaction(async (tx) => {
      await Promise.all(
        data.map(({ id, sortOrder }) =>
          tx.update(banners).set({ sortOrder }).where(eq(banners.id, id)),
        ),
      )
    })
    return { success: true }
  })
