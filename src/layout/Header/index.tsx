import { Link } from '@tanstack/react-router'
import {
  BellIcon,
  ChevronDownIcon,
  Command,
  HandbagIcon,
  HeadsetIcon,
  HeartIcon,
  SearchIcon,
} from 'lucide-react'
import { UserMenuDropdown } from './UserMenuDropdown'
import type { User } from '@/api/users/types'
import { useLoggedInUser } from '@/api/auth/queries'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Input } from '@/components/ui/input'

interface HeaderProps {
  initialUser: User | null
  privateLayout?: boolean
}

export default function Header({ initialUser, privateLayout }: HeaderProps) {
  const { data: loggedInUser } = useLoggedInUser({
    initialData: initialUser,
  })

  const isAdmin = loggedInUser?.role.includes('admin')

  return (
    <header className="sticky top-0 z-10 h-14 flex items-center justify-between px-5 border-b border-border bg-sidebar">
      <div className="flex items-center">
        {!privateLayout && (
          <Button
            variant="ghost"
            asChild
            className="mr-15 hover:bg-transparent!"
          >
            <Link to="/">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Command className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">My marketplace</span>
                <span className="truncate text-xs">Free plan</span>
              </div>
            </Link>
          </Button>
        )}
        <ButtonGroup>
          <Button variant="outline" aria-label="Search">
            Sve kategorije
            <ChevronDownIcon />
          </Button>
          <Input placeholder="Pretraga..." className="w-80" />
          <Button variant="outline">
            <SearchIcon />
          </Button>
        </ButtonGroup>
        {!isAdmin && (
          <Button variant="ghost" className="ml-5">
            <HeadsetIcon className="size-5" />
            Podrška
          </Button>
        )}
      </div>
      <div className="flex items-center gap-5">
        {!isAdmin && (
          <>
            <Button variant="ghost">
              <HeartIcon className="size-5" />
              Omiljeni
            </Button>
            <Button variant="ghost">
              <HandbagIcon className="size-5" />
              Korpa
            </Button>
            <Button variant="ghost" size="icon">
              <BellIcon className="size-5" />
            </Button>
          </>
        )}
        {loggedInUser ? (
          <UserMenuDropdown loggedInUser={loggedInUser} />
        ) : (
          <>
            <Link to="/login">
              <Button variant="ghost">Prijavi se</Button>
            </Link>
            <Link to="/register">
              <Button>Registruj se</Button>
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
