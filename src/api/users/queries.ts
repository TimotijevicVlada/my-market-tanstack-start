import { useQuery } from '@tanstack/react-query'
import { getPagedUsers } from './server'

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
