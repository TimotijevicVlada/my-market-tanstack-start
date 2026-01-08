import {
  LogOutIcon,
  Moon,
  PaletteIcon,
  StoreIcon,
  Sun,
  UserIcon,
} from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import type { User } from '@/api/users/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { removeAuthToken } from '@/lib/auth'
import { useLoggedInUser } from '@/api/auth/queries'
import { Switch, SwitchIndicator, SwitchWrapper } from '@/components/ui/switch'
import { useThemeStore } from '@/zustand/theme'
import {
  Avatar,
  AvatarFallback,
  AvatarIndicator,
  AvatarStatus,
} from '@/components/ui/avatar'
import { getRole } from '@/routes/_private/users/-data'
import { useGetSellerByUserId } from '@/api/sellers/queries'

interface UserMenuDropdownProps {
  loggedInUser: User
}

export const UserMenuDropdown = ({ loggedInUser }: UserMenuDropdownProps) => {
  const { data: user, refetch: refetchLoggedInUser } = useLoggedInUser({
    initialData: loggedInUser,
  })
  const { data: seller } = useGetSellerByUserId(user?.id)

  const { themeMode, toggleTheme } = useThemeStore()

  const navigate = useNavigate()

  const handleLogout = () => {
    removeAuthToken()
    refetchLoggedInUser()
    navigate({ to: '/' })
    toast.success('Uspešno ste se odjavili')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-10">
          <AvatarFallback className="bg-muted-foreground/20 cursor-pointer">
            {user?.username.charAt(0)}
          </AvatarFallback>
          {seller?.status === 'pending' && (
            <AvatarIndicator className="-end-1.5 -bottom-1.5">
              <AvatarStatus variant="busy" className="size-3.5" />
            </AvatarIndicator>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-50" align="end">
        <div className="flex flex-col p-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-ellipsis overflow-hidden whitespace-nowrap">
              {user?.username}
            </span>
            <span
              className={`text-xs font-bold text-white rounded-full px-2 py-0 capitalize ${user?.role ? getRole[user.role].color : ''}`}
            >
              {user?.role ? getRole[user.role].name : ''}
            </span>
          </div>
          <span className="text-xs text-muted-foreground text-ellipsis overflow-hidden whitespace-nowrap">
            {user?.email}
          </span>
          {seller?.status === 'pending' && (
            <div className="mt-3 text-xs border border-orange-500 rounded-sm p-2 bg-orange-500/10">
              Vaša prodavnica je u procesu verifikacije, obično je potrebno do
              24 sata.
            </div>
          )}
          {user?.role === 'buyer' && seller?.status !== 'pending' && (
            <DropdownMenuItem
              onClick={() =>
                navigate({ to: '/profile', search: { tab: 'create-seller' } })
              }
              className="mt-3 bg-primary text-white hover:bg-primary/90! hover:text-white!"
            >
              <StoreIcon className="text-white" />
              Postanite prodavac
            </DropdownMenuItem>
          )}
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            navigate({ to: '/profile', search: { tab: 'profile' } })
          }
        >
          <UserIcon />
          Moj profil
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault()
            toggleTheme()
          }}
        >
          <PaletteIcon />
          Tema
          <SwitchWrapper permanent className="ml-auto">
            <Switch size="md" checked={themeMode === 'dark'} />
            <SwitchIndicator state="on">
              <Sun className="size-3 text-muted-foreground" />
            </SwitchIndicator>
            <SwitchIndicator state="off">
              <Moon className="size-3 text-muted-foreground" />
            </SwitchIndicator>
          </SwitchWrapper>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOutIcon />
          Odjavi se
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
