import type {
  Seller,
  SellerStatus,
  VerificationStatus,
} from '@/api/sellers/types'

type Column = {
  label: string
  key: keyof Seller | 'actions' | 'order' | 'username'
  options?: React.ComponentProps<'td'>
}

export const sellersColumns: Array<Column> = [
  { label: '#', key: 'order' },
  { label: 'Status', key: 'isActive' },
  { label: 'Naziv', key: 'displayName' },
  { label: 'Korisničko ime', key: 'username' },
  { label: 'Telefon', key: 'phone' },
  { label: 'Email', key: 'email' },
  { label: 'Status odobrenja', key: 'status' },
  { label: 'Website', key: 'website' },
  { label: 'Država', key: 'country' },
  { label: 'Grad', key: 'city' },
  { label: 'Adresa', key: 'address' },
  { label: 'Poštanski broj', key: 'postalCode' },
  { label: 'Provizija', key: 'commissionRate' },
  { label: 'Prosečna ocena', key: 'ratingAvg' },
  { label: 'Broj ocena', key: 'ratingCount' },
  { label: 'Opis', key: 'description' },
  { label: 'Kategorije', key: 'categories' },
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

export const verificationStatusFilterOptions: Array<{
  id: VerificationStatus
  label: string
}> = [
    { id: 'pending', label: 'Na čekanju' },
    { id: 'approved', label: 'Odobreno' },
    { id: 'rejected', label: 'Odbijeno' },
  ]
