import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import { getLoggedInUser, login, register } from './server'
import type { User } from '@/api/users/types'
import type { LoginData, RegisterData } from './types'
import { setAuthToken } from '@/lib/auth'

export function useLogin() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: LoginData) => login({ data }),
    onSuccess: (response) => {
      setAuthToken(response.token)
      queryClient.invalidateQueries({ queryKey: ['loggedInUser'] })
      navigate({ to: '/' })
      toast.success('Prijavljivanje uspešno')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export function useRegister() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RegisterData) => register({ data }),
    onSuccess: (response) => {
      setAuthToken(response.token)
      navigate({ to: '/' })
      queryClient.invalidateQueries({ queryKey: ['loggedInUser'] })
      toast.success('Registracija uspešna')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useLoggedInUser = (options?: { initialData?: User | null }) => {
  return useQuery({
    queryKey: ['loggedInUser'],
    queryFn: async () => {
      try {
        return await getLoggedInUser()
      } catch {
        // User is not authenticated
        return null
      }
    },
    initialData: options?.initialData,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  })
}
