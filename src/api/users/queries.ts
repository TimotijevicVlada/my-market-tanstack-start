import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createUser, getPagedUsers, toggleUserActiveStatus } from './server'
import type { UserSchema } from '@/routes/_private/users/-components/CreateUser/schema'

export interface UsersParams {
  page: number
  limit: number
}

export const useGetUsers = (params: UsersParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getPagedUsers({ data: params }),
    placeholderData: (prev) => prev,
  })
}

export const useToggleUserActiveStatus = () => {
  return useMutation({
    mutationFn: (params: { userId: string }) =>
      toggleUserActiveStatus({ data: params }),
    onSuccess: (res) => {
      toast.success(
        `Korisnik ${res.username.toUpperCase()} je uspesno ${res.isActive ? 'aktiviran' : 'deaktiviran'}`,
      )
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useCreateUser = (params: UsersParams) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UserSchema) => createUser({ data }),
    onSuccess: () => {
      toast.success('Novi korisnik je uspesno kreiran')
      queryClient.invalidateQueries({ queryKey: ['users', params] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
