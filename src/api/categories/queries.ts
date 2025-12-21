import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createCategory, getCategories } from './server'

export const useCreateCategory = () => {
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      getCategories()
      toast.success('Kategorija uspešno kreirana')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
