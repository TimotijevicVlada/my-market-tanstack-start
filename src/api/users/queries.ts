import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getPagedUsers, toggleUserActiveStatus } from './server'

interface UseGetUsersParams {
  page: number
  limit: number
}

export const useGetUsers = (params: UseGetUsersParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getPagedUsers({ data: params }),
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
