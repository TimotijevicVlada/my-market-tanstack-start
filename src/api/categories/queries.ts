import { useMutation } from '@tanstack/react-query'
import { createCategory, getCategories } from './server'

export const useCreateCategory = () => {
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      getCategories()
    },
    onError: (error) => {
      console.error('Failed to create todo:', error.message)
    },
  })
}
