import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createSeller,
  deleteSeller,
  getPagedSellers,
  getSellerByUserId,
  toggleSellerActiveStatus,
  updateSeller,
  verifySeller,
} from './server'
import type {
  CreateSellerPayload,
  GetSellerParams,
  UpdateSellerPayload,
  VerifySellerParams,
} from './types'

export const useGetSellers = (params: GetSellerParams) => {
  return useQuery({
    queryKey: ['sellers', params],
    queryFn: () => getPagedSellers({ data: params }),
    placeholderData: (prev) => prev,
  })
}

export const useGetSellerByUserId = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['seller', userId],
    queryFn: () => getSellerByUserId({ data: { userId: userId ?? '' } }),
    placeholderData: (prev) => prev,
    enabled: !!userId,
  })
}

export const useToggleSellerActiveStatus = () => {
  return useMutation({
    mutationFn: (sellerId: string) =>
      toggleSellerActiveStatus({ data: { sellerId } }),
    onSuccess: (res) => {
      toast.success(
        `Prodavac ${res.displayName.toUpperCase()} je uspesno ${res.isActive ? 'aktiviran' : 'deaktiviran'}`,
      )
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useVerifySeller = (params: GetSellerParams) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: VerifySellerParams) => verifySeller({ data }),
    onSuccess: (res) => {
      toast.success(
        `Prodavac ${res.displayName.toUpperCase()} je uspesno ${res.status === 'approved' ? 'odobren' : 'odbijen'}`,
      )
      queryClient.invalidateQueries({ queryKey: ['sellers', params] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteSeller = (params: GetSellerParams) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sellerId: string) => deleteSeller({ data: { sellerId } }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['sellers', params] })
      toast.success(
        `Prodavac ${res.displayName.toUpperCase()} je uspesno obrisan`,
      )
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useCreateSeller = (params: GetSellerParams) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSellerPayload) => createSeller({ data }),
    onSuccess: (res) => {
      toast.success(
        `Prodavac ${res.seller.displayName.toUpperCase()} je uspesno kreiran`,
      )
      queryClient.invalidateQueries({ queryKey: ['sellers', params] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateSeller = (params: GetSellerParams) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateSellerPayload) => updateSeller({ data }),
    onSuccess: (res) => {
      toast.success(
        `Prodavac ${res.seller.displayName.toUpperCase()} je uspesno azuriran`,
      )
      queryClient.invalidateQueries({ queryKey: ['sellers', params] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
