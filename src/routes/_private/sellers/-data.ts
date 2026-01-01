import type { Seller, SellerStatus } from '@/api/sellers/types'

type Column = {
  label: string
  key: keyof Seller | 'actions' | 'order' | 'username'
  options?: React.ComponentProps<'td'>
}

export const sellersColumns: Array<Column> = [
  { label: '#', key: 'order' },
  { label: 'Aktivan', key: 'isActive' },
  { label: 'Naziv', key: 'displayName' },
  { label: 'Korisničko ime', key: 'username' },
  { label: 'Telefon', key: 'phone' },
  { label: 'Email', key: 'email' },
  { label: 'Status', key: 'status' },
  { label: 'Website', key: 'website' },
  { label: 'Država', key: 'country' },
  { label: 'Grad', key: 'city' },
  { label: 'Adresa', key: 'address' },
  { label: 'Poštanski broj', key: 'postalCode' },
  { label: 'Napomena verifikacije', key: 'verificationNote' },
  { label: 'Provizija', key: 'commissionRate' },
  { label: 'Prosečna ocena', key: 'ratingAvg' },
  { label: 'Broj ocena', key: 'ratingCount' },
  { label: 'Opis', key: 'description' },
  { label: 'Kreirano', key: 'createdAt' },
  { label: 'Ažurirano', key: 'updatedAt' },
  { label: 'Akcije', key: 'actions', options: { className: 'text-right' } },
]

export const statusFilterOptions: Array<{
  id: SellerStatus
  label: string
}> = [
  { id: 'active', label: 'Aktivne' },
  { id: 'inactive', label: 'Neaktivne' },
]
