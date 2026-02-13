import type { banners } from '@/db/schema/banners'

export type Banner = typeof banners.$inferSelect

export type BannerPlacement = Banner['placement']
