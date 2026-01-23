import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import { getLinkedAccounts, getSessionUser, linkAccountWithCredentials, updateSessionUserAvatar, updateSessionUserBasicInfo } from './server'
import type { Session } from '@/lib/auth'
import type { LoginData, RegisterData } from './types'
import type { Provider } from '@/routes/_private/account/-components/AccountsSection'
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
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export function useFacebookSignIn() {
  return useMutation({
    mutationFn: () => authClient.signIn.social({ provider: "facebook" }),
    onError: (error) => {
      toast.error(error.message)
    },
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


export const useUpdateSessionUserBasicInfo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { name: string; email: string }) => updateSessionUserBasicInfo({ data }),
    onSuccess: () => {
      toast.success('Vaše osnovne informacije su uspešno izmenjene')
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

export const useGetLinkedAccounts = () => {
  return useQuery({
    queryKey: ['linkedAccounts'],
    queryFn: async () => {
      const accounts = await getLinkedAccounts()
      return accounts
    },
  })
}

export const useLinkAccountWithCredentials = () => {
  return useMutation({
    mutationFn: (data: { password: string }) => linkAccountWithCredentials({ data }),
    onSuccess: () => {
      toast.success('Vaša lozinka je uspešno povezana')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useConnectProvider = (provider: Provider) => {
  return useMutation({
    mutationFn: async () => {
      const result = await authClient.linkSocial({ provider, callbackURL: '/account' })

      if (result.error) {
        throw new Error(errorMapper(result.error.message))
      }

      return result.data
    },
    onSuccess: () => {
      toast.success(`${provider} nalog je uspešno povezan`)
    },
    onError: (error) => {
      toast.error(errorMapper(error.message))
    },
  })
}

export const useDisconnectProvider = (providerId: Provider) => {
  return useMutation({
    mutationFn: async (accountId: string | undefined) => {
      const result = await authClient.unlinkAccount(
        { providerId, accountId },
      )

      if (result.error) {
        throw new Error(errorMapper(result.error.message))
      }

      return result.data
    },
    onSuccess: () => {
      toast.success(`${providerId} nalog je uspešno prekinut`)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: async (data: { email: string }) => {
      const result = await authClient.requestPasswordReset({
        email: data.email,
        redirectTo: "/reset-password",
      })

      if (result.error) {
        throw new Error(errorMapper(result.error.message))
      }

      return result.data
    },
    onSuccess: () => {
      toast.success('Poslali smo vam email za resetovanje lozinke')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data: { newPassword: string; token: string }) => {
      const result = await authClient.resetPassword({
        newPassword: data.newPassword,
        token: data.token,
      })

      if (result.error) {
        throw new Error(errorMapper(result.error.message))
      }

      return result.data
    },
    onSuccess: () => {
      toast.success('Lozinka je uspešno resetovana')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: async () => {
      const result = await authClient.deleteUser({
        callbackURL: "/goodbye",
      })

      if (result.error) {
        throw new Error(errorMapper(result.error.message))
      }

      return result.data
    },
    onSuccess: () => {
      toast.success('Poslali smo vam email za potvrdu brisanja naloga')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}