import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createBanner,
  deleteBanner,
  getActiveBannersByPlacement,
  getBannerById,
  getBannersByPlacement,
  toggleBannerActive,
  updateBanner,
  updateBannerSortOrder,
} from './server'
import type { BannerPlacement } from './types'

export const useCreateBanner = () => {
  return useMutation({
    mutationFn: createBanner,
    onSuccess: () => {
      toast.success('Baner je uspešno kreiran')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useGetBannersByPlacement = (placement: BannerPlacement) => {
  return useQuery({
    queryKey: ['banners', placement],
    queryFn: () => getBannersByPlacement({ data: { placement } }),
  })
}

export const useGetBannerById = (id: string) => {
  return useQuery({
    queryKey: ['banner', id],
    queryFn: () => getBannerById({ data: { id } }),
  })
}

export const useUpdateBanner = () => {
  return useMutation({
    mutationFn: updateBanner,
    onSuccess: () => {
      toast.success('Baner je uspešno izmenjen')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteBanner = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteBanner,
    onSuccess: () => {
      toast.success('Baner je uspešno obrisan')
      queryClient.invalidateQueries({ queryKey: ['banners'], exact: false })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useToggleBannerActive = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleBannerActive,
    onSuccess: () => {
      toast.success('Baner je uspešno aktiviran/deaktiviran')
      queryClient.invalidateQueries({ queryKey: ['banners'], exact: false })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateBannerSortOrder = () => {
  return useMutation({
    mutationFn: updateBannerSortOrder,
    onSuccess: () => {
      toast.success('Baner je uspešno sortiran')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useGetActiveBannersByPlacement = (placement: BannerPlacement) => {
  return useQuery({
    queryKey: ['activeBanners', placement],
    queryFn: () => getActiveBannersByPlacement({ data: { placement } }),
  })
}
