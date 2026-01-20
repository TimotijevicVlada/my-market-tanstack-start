import {
  LogOutIcon,
  Moon,
  PaletteIcon,
  StoreIcon,
  Sun,
  UserIcon,
} from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import type { User } from '@/api/users/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Switch, SwitchIndicator, SwitchWrapper } from '@/components/ui/switch'
import { useThemeStore } from '@/zustand/theme'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getRole } from '@/routes/_private/admin/users/-data'
import { useGetMySeller } from '@/api/sellers/queries'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useGetSessionUser, useSignOut } from '@/api/auth/queries'
import { Spinner } from '@/components/ui/spinner'


export const UserMenuDropdown = () => {

  const { data: sessionUser } = useGetSessionUser()

  const { data: seller } = useGetMySeller()

  const { themeMode, toggleTheme } = useThemeStore()

  const { mutate: signOut, isPending: isSigningOut } = useSignOut()

  const navigate = useNavigate()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-10">
          <AvatarFallback className="bg-muted-foreground/20 cursor-pointer">
            {sessionUser?.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-50" align="end">
        <div className="flex flex-col p-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-ellipsis overflow-hidden whitespace-nowrap">
              {sessionUser?.name}
            </span>
            <span
              className={`text-xs font-bold text-white rounded-full px-2 py-0 capitalize ${sessionUser?.role ? getRole[sessionUser.role as User['role']].color : ''}`}
            >
              {sessionUser?.role ? getRole[sessionUser.role as User['role']].name : ''}
            </span>
          </div>
          <span className="text-xs text-muted-foreground text-ellipsis overflow-hidden whitespace-nowrap">
            {sessionUser?.email}
          </span>
          {seller?.status === 'pending' && (
            <Alert variant="warning" appearance="light" className="mt-3 p-2">
              <AlertTitle className="text-xs!">
                Vaša prodavnica je u procesu verifikacije, obično je potrebno do
                24 sata.
              </AlertTitle>
            </Alert>
          )}
          {seller?.status === 'rejected' && (
            <Alert
              variant="destructive"
              appearance="light"
              className="mt-3 p-2"
            >
              <div>
                <AlertTitle className="text-xs!">
                  Vaša prodavnica je odbijena.
                </AlertTitle>
                {seller.verificationNote && (
                  <AlertDescription className="text-xs!">
                    Razlog odbijanja: {seller.verificationNote}
                  </AlertDescription>
                )}
              </div>
            </Alert>
          )}
          {sessionUser?.role === 'buyer' &&
            seller?.status !== 'pending' &&
            seller?.status !== 'rejected' && (
              <DropdownMenuItem
                onClick={() => navigate({ to: '/seller-apply' })}
                className="mt-3 bg-primary text-primary-foreground hover:bg-primary/90! hover:text-primary-foreground!"
              >
                <StoreIcon className="text-primary-foreground" />
                Postanite prodavac
              </DropdownMenuItem>
            )}
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate({ to: '/account' })}>
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
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOutIcon />
          Odjavi se
          {isSigningOut && (
            <Spinner className='ml-auto' />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
