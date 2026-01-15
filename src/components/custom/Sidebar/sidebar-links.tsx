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

interface SidebarLinkGroup {
  label: string
  links: Array<SidebarLink>
}

export function SidebarLinks() {
  const { data: user } = useLoggedInUser()

  const location = useLocation()

  const groups = user ? sidebarLinks[user.role] : []

  return (
    <>
      {groups.map((group, groupIndex) => (
        <SidebarGroup key={groupIndex}>
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          <SidebarMenu>
            {group.links.map((link) => (
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
      ))}
    </>
  )
}

const sidebarLinks: Record<User['role'], Array<SidebarLinkGroup>> = {
  buyer: [
    {
      label: 'Nalog',
      links: [
        {
          name: 'Moj nalog',
          url: '/account',
          icon: UserIcon,
        },
        {
          name: 'Moje porudžbine',
          url: '/account/orders',
          icon: HandbagIcon,
        },
      ],
    },
  ],
  seller: [
    {
      label: 'Nalog',
      links: [
        {
          name: 'Moj nalog',
          url: '/account',
          icon: UserIcon,
        },
        {
          name: 'Moje porudžbine',
          url: '/account/orders',
          icon: HandbagIcon,
        },
      ],
    },
    {
      label: 'Moja prodavnica',
      links: [
        {
          name: 'Profil prodavnice',
          url: '/seller/info',
          icon: StoreIcon,
        },
        {
          name: 'Proizvodi',
          url: '/seller/products',
          icon: PackageIcon,
        },
      ],
    },
  ],
  admin: [
    {
      label: 'Nalog',
      links: [
        {
          name: 'Moj nalog',
          url: '/account',
          icon: UserIcon,
        },
      ],
    },
    {
      label: 'Administracija',
      links: [
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
    },
  ],
  'super-admin': [
    {
      label: 'Nalog',
      links: [
        {
          name: 'Moj nalog',
          url: '/account',
          icon: UserIcon,
        },
      ],
    },
  ],
}
