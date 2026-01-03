import type { User, UserRole, UserStatus } from '@/api/users/types'

export const getRole = {
  seller: { name: 'Prodavač', color: `bg-blue-500` },
  buyer: { name: 'Kupac', color: `bg-yellow-500` },
  admin: { name: 'Admin', color: `bg-purple-500` },
  'super-admin': { name: 'Super Admin', color: `bg-red-500` },
}

type Column = {
  label: string
  key: keyof User | 'actions' | 'order' | 'productCount'
  options?: React.ComponentProps<'td'>
}

export const usersColumns: Array<Column> = [
  { label: '#', key: 'order' },
  { label: 'Status', key: 'isActive' },
  { label: 'Korisničko ime', key: 'username' },
  { label: 'Email adresa', key: 'email' },
  { label: 'Uloga', key: 'role' },
  { label: 'Broj proizvoda', key: 'productCount' },
  { label: 'Datum kreiranja', key: 'createdAt' },
  { label: 'Datum ažuriranja', key: 'updatedAt' },
  { label: 'Akcije', key: 'actions', options: { className: 'text-right' } },
]

export const statusFilterOptions: Array<{
  id: UserStatus
  label: string
}> = [
  { id: 'active', label: 'Aktivne' },
  { id: 'inactive', label: 'Neaktivne' },
]

export const roleFilterOptions: Array<{
  id: UserRole
  label: string
}> = [
  { id: 'seller', label: 'Prodavac' },
  { id: 'buyer', label: 'Kupac' },
  { id: 'admin', label: 'Admin' },
  { id: 'super-admin', label: 'Super Admin' },
]
