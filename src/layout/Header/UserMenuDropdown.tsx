import { LogOutIcon, Moon, PaletteIcon, Sun, UserIcon } from 'lucide-react'
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface UserMenuDropdownProps {
  loggedInUser: User
}

export const UserMenuDropdown = ({ loggedInUser }: UserMenuDropdownProps) => {
  const { data: user, refetch: refetchLoggedInUser } = useLoggedInUser({
    initialData: loggedInUser,
  })

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
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-50" align="end">
        <div className="flex flex-col py-2 px-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-ellipsis overflow-hidden whitespace-nowrap">
              {user?.username}
            </span>
            <span className="text-xs font-bold text-white bg-primary rounded-full px-2 py-0 capitalize">
              {user?.role}
            </span>
          </div>
          <span className="text-xs text-muted-foreground text-ellipsis overflow-hidden whitespace-nowrap">
            {user?.email}
          </span>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate({ to: '/profile' })}>
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
