import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import { getSessionUser, updateSessionUserAvatar, updateSessionUserEmail } from './server'
import type { Session } from '@/lib/auth'
import type { LoginData, RegisterData } from './types'
import { authClient } from '@/lib/auth-client'
import { errorMapper } from '@/lib/error-mapper'

export function useLogin() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      })

      if (result.error) {
        throw new Error(errorMapper(result.error.message))
      }

      return result.data
    },
    onSuccess: () => {
      navigate({ to: '/' })
      toast.success('Prijavljivanje uspešno')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}


export function useGoogleSignIn() {
  return useMutation({
    mutationFn: () => authClient.signIn.social({ provider: "google" }),
  })
}

export function useRegister() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const result = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.username,
      })

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result.data
    },
    onSuccess: () => {
      navigate({ to: '/' })
      toast.success('Registracija uspešna')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useSignOut = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await authClient.signOut()
    },
    onSuccess: () => {
      queryClient.setQueryData(['sessionUser'], null)
      navigate({ to: '/' })
      toast.success('Uspešno ste se odjavili')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useGetSessionUser = (initialData?: Session['user']) => {
  return useQuery({
    queryKey: ['sessionUser'],
    queryFn: async () => {
      const { user } = await getSessionUser()
      return user
    },
    initialData,
  })
}

export const useUpdateSessionUserAvatar = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { avatarUrl: string | null | undefined }) =>
      updateSessionUserAvatar({ data }),
    onSuccess: () => {
      toast.success('Slika profila je uspesno izmenjena')
      queryClient.invalidateQueries({ queryKey: ['sessionUser'] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}


export const useUpdateSessionUserEmail = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { email: string }) => updateSessionUserEmail({ data }),
    onSuccess: () => {
      toast.success('Vaša email adresa je uspešno izmenjena')
      queryClient.invalidateQueries({ queryKey: ['sessionUser'] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export function useChangeSessionUserPassword() {
  return useMutation({
    mutationFn: async (params: { currentPassword: string; newPassword: string }) => {
      const result = await authClient.changePassword({
        currentPassword: params.currentPassword,
        newPassword: params.newPassword,
        revokeOtherSessions: true,
      })

      if (result.error) {
        throw new Error(errorMapper(result.error.message))
      }

      return result.data.user
    },
    onSuccess: () => {
      toast.success('Vaša lozinka je uspešno promenjena')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
