import { useQuery } from '@tanstack/react-query'
import { getPagedSellers } from './server'
import type { GetSellerParams } from './types'

export const useGetSellers = (params: GetSellerParams) => {
  return useQuery({
    queryKey: ['sellers', params],
    queryFn: () => getPagedSellers({ data: params }),
    placeholderData: (prev) => prev,
  })
}
