import {
  FolderTreeIcon,
  HandbagIcon,
  PackageIcon,
  PencilIcon,
  PlusIcon,
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { authClient } from '@/lib/auth-client'

interface SidebarLink {
  name: string
  url: FileRouteTypes['to']
  icon: React.ElementType
  sublink?: Array<SidebarLink>
}

interface SidebarLinkGroup {
  label: string
  links: Array<SidebarLink>
}

export function SidebarLinks() {
  const { data: session } = authClient.useSession()

  const user = session?.user

  const location = useLocation()

  const groups = user ? sidebarLinks[user.role as User['role']] : []

  const getSublink = (link: SidebarLink) => {
    return link.sublink?.find((sublink) => {
      if (location.pathname === sublink.url) return true
      const pattern = sublink.url.replace(/\$[\w]+/g, '')
      return pattern && location.pathname.startsWith(pattern)
    })
  }

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
                {getSublink(link) && (
                  <SidebarMenuSub>
                    <SidebarMenuSubItem key={getSublink(link)?.name}>
                      <SidebarMenuSubButton asChild isActive>
                        <Link to={location.pathname}>
                          {getSublink(link)?.name}
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                )}
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
          sublink: [
            {
              name: 'Kreiranje proizvoda',
              url: '/seller/products/create',
              icon: PlusIcon,
            },
            {
              name: 'Izmena proizvoda',
              url: '/seller/products/edit/$productId',
              icon: PencilIcon,
            },
          ],
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
