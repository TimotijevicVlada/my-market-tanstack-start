import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  deleteSeller,
  getPagedSellers,
  toggleSellerActiveStatus,
  verifySeller,
} from './server'
import type { GetSellerParams, VerifySellerParams } from './types'

export const useGetSellers = (params: GetSellerParams) => {
  return useQuery({
    queryKey: ['sellers', params],
    queryFn: () => getPagedSellers({ data: params }),
    placeholderData: (prev) => prev,
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
