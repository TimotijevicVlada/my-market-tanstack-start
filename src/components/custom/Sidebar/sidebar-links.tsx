import {
  FolderTreeIcon,
  HandbagIcon,
  PackageIcon,
  StoreIcon,
  UserIcon,
  UsersIcon,
} from 'lucide-react'
import { Link, useLocation } from '@tanstack/react-router'
import type { FileRouteTypes } from '@/routeTree.gen'
import type { User } from '@/api/users/types'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useLoggedInUser } from '@/api/auth/queries'

interface SidebarLink {
  name: string
  url: FileRouteTypes['to']
  icon: React.ElementType
}

export function SidebarLinks() {
  const { data: user } = useLoggedInUser()

  const location = useLocation()

  const links = user ? sidebarLinks[user.role] : []

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Opste</SidebarGroupLabel>
      <SidebarMenu>
        {links.map((link) => (
          <SidebarMenuItem key={link.name}>
            <SidebarMenuButton
              asChild
              isActive={location.pathname === link.url}
              tooltip={link.name}
            >
              <Link to={link.url}>
                <link.icon />
                <span>{link.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

const sidebarLinks: Record<User['role'], Array<SidebarLink>> = {
  buyer: [
    {
      name: 'Moj nalog',
      url: '/account',
      icon: UserIcon,
    },
    {
      name: 'Moje porudžbine',
      url: '/buyer/orders',
      icon: HandbagIcon,
    },
  ],
  seller: [
    {
      name: 'Moj nalog',
      url: '/account',
      icon: UserIcon,
    },
    {
      name: 'Moja prodavnica',
      url: '/seller/info',
      icon: StoreIcon,
    },
    {
      name: 'Moji proizvodi',
      url: '/seller/products',
      icon: PackageIcon,
    },
  ],
  admin: [
    {
      name: 'Moj nalog',
      url: '/account',
      icon: UserIcon,
    },
    {
      name: 'Korisnici',
      url: '/admin/users',
      icon: UsersIcon,
    },
    {
      name: 'Kategorije',
      url: '/admin/categories',
      icon: FolderTreeIcon,
    },
    {
      name: 'Prodavci',
      url: '/admin/sellers',
      icon: StoreIcon,
    },
  ],
  'super-admin': [
    {
      name: 'Moj nalog',
      url: '/account',
      icon: UserIcon,
    },
  ],
}
