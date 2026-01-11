import {
  HandbagIcon,
  ListIcon,
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
      icon: ListIcon,
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
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}
              >
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
