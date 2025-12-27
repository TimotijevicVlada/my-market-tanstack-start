import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createCategory, getCategories, getPagedCategories } from './server'
import type { GetCategoriesParams } from './types'

export const useGetCategories = (params: GetCategoriesParams) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => getPagedCategories({ data: params }),
    placeholderData: (prev) => prev,
  })
}

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
