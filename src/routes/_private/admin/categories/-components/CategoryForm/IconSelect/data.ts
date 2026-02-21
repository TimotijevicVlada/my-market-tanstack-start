import type { CategoryIcon } from '@/routes/_private/admin/categories/-data'
import { categoryIconOptions } from '@/routes/_private/admin/categories/-data'

const categoryIconLabelsSr: Record<CategoryIcon, string> = {
  folder: 'Fascikla',
  'home-appliances': 'Kućni aparati',
  'tv-audio-and-video': 'TV, audio i video',
  'beauty-tools': 'Alatke za lepotu',
  'home-and-garden': 'Dom i bašta',
  vehicle: 'Vozila',
  'it-shop': 'IT prodavnica',
  gaming: 'Gejming',
  'sport-and-recreation': 'Sport i rekreacija',
  phones: 'Telefoni',
  'childrens-equipement': 'Dečja oprema',
  'maintenance-and-cleaning': 'Održavanje i čišćenje',
  'beauty-and-care': 'Lepota i nega',
  clothes: 'Odeća',
  'fashion-accessories': 'Modni dodaci',
  footwear: 'Obuća',
  'pet-shop': 'Trgovina za ljubimce',
  'nutrition-and-health': 'Ishrana i zdravlje',
  'bookstore-and-entertainment': 'Knjižara i zabava',
  'food-and-drink': 'Hrana i piće',
  'toys-for-children': 'Igračke za decu',
  'office-and-school-supplies': 'Kancelarijski i školski pribor',
  'musical-instruments-and-equipment': 'Muzički instrumenti i oprema',
  'domestic-tradition-products': 'Domaći i tradicionalni proizvodi',
  other: 'Ostalo',
}

export const iconOptions = (
  Object.keys(categoryIconOptions) as Array<CategoryIcon>
).map((value) => ({
  value,
  label: categoryIconLabelsSr[value],
  icon: categoryIconOptions[value],
}))
