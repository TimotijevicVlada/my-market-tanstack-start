import { toast } from 'sonner'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createProduct, getProductById } from './server'

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
