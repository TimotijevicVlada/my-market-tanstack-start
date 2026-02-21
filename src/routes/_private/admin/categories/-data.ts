import {
  Baby,
  BookOpen,
  Briefcase,
  BrushCleaning,
  Car,
  CircleQuestionMark,
  Dumbbell,
  Flower2,
  Folder,
  Footprints,
  Gamepad,
  Gamepad2,
  HeartPulse,
  House,
  Monitor,
  Music,
  PawPrint,
  Shirt,
  Smartphone,
  Sparkles,
  SprayCan,
  Tv,
  Utensils,
  Watch,
  Wrench,
} from 'lucide-react'
import type { Category, CategoryStatus } from '@/api/categories/types'
import type { categoryIconEnum } from '@/db/schema/categories'
import type { ElementType } from 'react'

type Column = {
  label: string
  key: keyof Category | 'actions' | 'order' | 'parentName'
  options?: React.ComponentProps<'td'>
}

export const categoriesColumns: Array<Column> = [
  { label: '#', key: 'order' },
  { label: 'Status', key: 'isActive' },
  { label: 'Naziv', key: 'name' },
  { label: 'Slug', key: 'slug' },
  { label: 'Nadređena kategorija', key: 'parentName' },
  { label: 'Opis', key: 'description' },
  { label: 'Kreirano', key: 'createdAt' },
  { label: 'Ažurirano', key: 'updatedAt' },
  { label: 'Akcije', key: 'actions', options: { className: 'text-right' } },
]

export const statusFilterOptions: Array<{
  id: CategoryStatus
  label: string
}> = [
  { id: 'active', label: 'Aktivne' },
  { id: 'inactive', label: 'Neaktivne' },
]

export type CategoryIcon = (typeof categoryIconEnum.enumValues)[number]

export const categoryIconOptions: Record<CategoryIcon, ElementType> = {
  folder: Folder,
  'home-appliances': Wrench,
  'tv-audio-and-video': Tv,
  'beauty-tools': BrushCleaning,
  'home-and-garden': Flower2,
  vehicle: Car,
  'it-shop': Monitor,
  gaming: Gamepad,
  'sport-and-recreation': Dumbbell,
  phones: Smartphone,
  'childrens-equipement': Baby,
  'maintenance-and-cleaning': SprayCan,
  'beauty-and-care': Sparkles,
  clothes: Shirt,
  'fashion-accessories': Watch,
  footwear: Footprints,
  'pet-shop': PawPrint,
  'nutrition-and-health': HeartPulse,
  'bookstore-and-entertainment': BookOpen,
  'food-and-drink': Utensils,
  'toys-for-children': Gamepad2,
  'office-and-school-supplies': Briefcase,
  'musical-instruments-and-equipment': Music,
  'domestic-tradition-products': House,
  other: CircleQuestionMark,
}
