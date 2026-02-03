import { toast } from 'sonner'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createProduct,
  getPagedProducts,
  getProductById,
  updateProduct,
} from './server'
import type { GetProductsParams } from './types'

export const useCreateProduct = () => {
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success('Proizvod je uspešno kreiran')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useGetProductById = (productId: string) => {
  return useQuery({
    queryKey: ['product-by-id', productId],
    queryFn: () => getProductById({ data: { productId } }),
  })
}

export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      toast.success('Proizvod je uspešno ažuriran')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useGetProducts = (params: GetProductsParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getPagedProducts({ data: params }),
    placeholderData: (prev) => prev,
  })
}
