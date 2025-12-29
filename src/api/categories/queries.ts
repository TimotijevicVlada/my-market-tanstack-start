import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createCategory,
  editCategory,
  getCategories,
  getPagedCategories,
  toggleCategoryActiveStatus,
} from './server'
import type { GetCategoriesParams } from './types'

export const useGetCategories = (params: GetCategoriesParams) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => getPagedCategories({ data: params }),
    placeholderData: (prev) => prev,
  })
}

export const useGetAllCategories = () => {
  return useQuery({
    queryKey: ['categories-all'],
    queryFn: () => getCategories(),
    placeholderData: (prev) => prev,
  })
}

export const useCreateCategory = (params: GetCategoriesParams) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success('Kategorija je uspešno kreirana')
      queryClient.invalidateQueries({ queryKey: ['categories', params] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useEditCategory = (params: GetCategoriesParams) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: editCategory,
    onSuccess: () => {
      toast.success('Kategorija je uspešno izmenjena')
      queryClient.invalidateQueries({ queryKey: ['categories', params] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useToggleCategoryActiveStatus = () => {
  return useMutation({
    mutationFn: toggleCategoryActiveStatus,
    onSuccess: (res) => {
      toast.success(
        `Kategorija ${res.name.toUpperCase()} je uspesno ${res.isActive ? 'aktivirana' : 'deaktivirana'}`,
      )
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
