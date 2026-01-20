import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  // createUser,
  deleteUser,
  editUser,
  getAllUsers,
  getPagedUsers,
  toggleUserActiveStatus,
} from './server'
import type {
  // CreateUserSchema,
  EditUserSchema,
} from '@/routes/_private/admin/users/-components/zod-schema'
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
    // onSuccess: (res) => {
    // toast.success(
    //   `Korisnik ${res.username.toUpperCase()} je uspesno ${res.isActive ? 'aktiviran' : 'deaktiviran'}`,
    // )
    // },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteUser = (params: GetUsersParams) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { userId: string }) => deleteUser({ data }),
    onSuccess: () => {
      // toast.success(
      //   `Korisnik ${res.user.username.toUpperCase()} je uspesno obrisan`,
      // )
      queryClient.invalidateQueries({ queryKey: ['users', params] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

// export const useCreateUser = (params: GetUsersParams) => {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: (data: CreateUserSchema) => createUser({ data }),
//     onSuccess: () => {
//       toast.success('Novi korisnik je uspesno kreiran')
//       queryClient.invalidateQueries({ queryKey: ['users', params] })
//     },
//     onError: (error) => {
//       toast.error(error.message)
//     },
//   })
// }

export const useEditUser = (params: GetUsersParams) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: EditUserSchema & { userId: string }) =>
      editUser({ data }),
    onSuccess: () => {
      // toast.success(
      //   `Korisnik ${res.name.toUpperCase()} je uspesno izmenjen`,
      // )
      queryClient.invalidateQueries({ queryKey: ['users', params] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
