import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import { login, register } from './server'
import { setAuthToken } from '@/lib/auth'

interface LoginData {
  email: string
  password: string
}

interface RegisterData {
  username: string
  email: string
  password: string
  role?: 'producer' | 'buyer' | 'admin'
}

export function useLogin() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: LoginData) => login({ data }),
    onSuccess: (response) => {
      setAuthToken(response.token)
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

  return useMutation({
    mutationFn: (data: RegisterData) => register({ data }),
    onSuccess: (response) => {
      setAuthToken(response.token)
      navigate({ to: '/' })
      toast.success('Registracija uspešna')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
