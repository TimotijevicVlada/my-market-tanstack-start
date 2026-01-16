import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createUser,
  deleteUser,
  editUser,
  editUserPassword,
  getAllUsers,
  getPagedUsers,
  toggleUserActiveStatus,
  updateMyUserAvatar,
  updateMyUserEmail,
  updateMyUserPassword,
} from './server'
import type {
  CreateUserSchema,
  EditUserSchema,
} from '@/routes/_private/admin/users/-components/zod-schema'
import type { EditPasswordSchema } from '@/routes/_private/admin/users/-components/EditPassword/zod-schema'
import type { GetUsersParams } from './types'

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ['users-all'],
    queryFn: () => getAllUsers(),
    placeholderData: (prev) => prev,
  })
}

export const useGetUsers = (params: GetUsersParams) => {
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

export const useDeleteUser = (params: GetUsersParams) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { userId: string }) => deleteUser({ data }),
    onSuccess: (res) => {
      toast.success(
        `Korisnik ${res.user.username.toUpperCase()} je uspesno obrisan`,
      )
      queryClient.invalidateQueries({ queryKey: ['users', params] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useCreateUser = (params: GetUsersParams) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserSchema) => createUser({ data }),
    onSuccess: () => {
      toast.success('Novi korisnik je uspesno kreiran')
      queryClient.invalidateQueries({ queryKey: ['users', params] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useEditUser = (params: GetUsersParams) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: EditUserSchema & { userId: string }) =>
      editUser({ data }),
    onSuccess: (res) => {
      toast.success(
        `Korisnik ${res.username.toUpperCase()} je uspesno izmenjen`,
      )
      queryClient.invalidateQueries({ queryKey: ['users', params] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useEditUserPassword = (params: GetUsersParams) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: EditPasswordSchema & { userId: string }) =>
      editUserPassword({ data }),
    onSuccess: (res) => {
      toast.success(
        `Lozinka korisnika ${res.user.username.toUpperCase()} je uspesno izmenjena`,
      )
      queryClient.invalidateQueries({ queryKey: ['users', params] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateMyUserAvatar = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { avatarUrl: string | null | undefined }) =>
      updateMyUserAvatar({ data }),
    onSuccess: () => {
      toast.success('Slika profila je uspesno izmenjena')
      queryClient.invalidateQueries({ queryKey: ['loggedInUser'] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateMyUserEmail = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { email: string }) => updateMyUserEmail({ data }),
    onSuccess: () => {
      toast.success('Email je uspesno izmenjen')
      queryClient.invalidateQueries({ queryKey: ['loggedInUser'] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateMyUserPassword = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { oldPassword: string; newPassword: string }) =>
      updateMyUserPassword({ data }),
    onSuccess: () => {
      toast.success('Vaša lozinka je uspešno izmenjena')
      queryClient.invalidateQueries({ queryKey: ['loggedInUser'] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
