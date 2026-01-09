import { PlusIcon, UserIcon } from 'lucide-react'

interface Tab {
  label: string
  value: 'profile' | 'create-seller'
  icon: React.ReactNode
}

export const tabs: Array<Tab> = [
  {
    label: 'Moji podaci',
    value: 'profile',
    icon: <UserIcon className="size-5" />,
  },
  {
    label: 'Kreiraj prodavnicu',
    value: 'create-seller',
    icon: <PlusIcon className="size-5" />,
  },
]
