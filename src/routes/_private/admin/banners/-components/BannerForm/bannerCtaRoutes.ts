import type { FileRoutesByFullPath } from '@/routeTree.gen'

export const BANNER_CTA_ROUTES: Array<{
  path: keyof FileRoutesByFullPath
  name: string
}> = [
  { path: '/', name: 'Početna' },
  { path: '/seller/products/', name: 'Moji proizvodi' },
  { path: '/seller/products/create/', name: 'Dodaj proizvod' },
  { path: '/seller/info/', name: 'Informacije prodavca' },
  { path: '/buyer/orders/', name: 'Porudžbine (kupac)' },
  { path: '/account/', name: 'Moj nalog' },
  { path: '/account/orders/', name: 'Moje porudžbine' },
  { path: '/seller-apply/', name: 'Prijava kao prodavac' },
  { path: '/login/', name: 'Prijava' },
  { path: '/register/', name: 'Registracija' },
  { path: '/goodbye', name: 'Odjava' },
]

export const BANNER_CTA_OPTIONS = BANNER_CTA_ROUTES.map(({ path }) => ({
  id: path,
  name: path,
}))
