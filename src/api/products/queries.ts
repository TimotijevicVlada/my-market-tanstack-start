import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { createProduct } from './server'

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
