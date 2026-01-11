import { ImageIcon, Mail, MapPin, Store } from 'lucide-react'

export const STEPS = [
  { id: 1, title: 'Opšte', description: 'Osnovne informacije', icon: Store },
  { id: 2, title: 'Kontakt', description: 'Kontakt podaci', icon: Mail },
  { id: 3, title: 'Lokacija', description: 'Adresa prodavnice', icon: MapPin },
  {
    id: 4,
    title: 'Slike',
    description: 'Logo i naslovna slika',
    icon: ImageIcon,
  },
]
