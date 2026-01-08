import { Link } from '@tanstack/react-router'
import {
  BellIcon,
  ChevronDownIcon,
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
}

export default function Header({ initialUser }: HeaderProps) {
  const { data: loggedInUser } = useLoggedInUser({
    initialData: initialUser,
  })

  return (
    <header className="h-14 flex items-center justify-between px-20 border-b border-border bg-sidebar">
      <div className="flex items-center">
        <Link to="/" className="cursor-pointer">
          <img src="/logo.png" alt="Logo" className="h-9" />
        </Link>
        <ButtonGroup className="ml-25">
          <Button variant="outline" aria-label="Search">
            Sve kategorije
            <ChevronDownIcon />
          </Button>
          <Input placeholder="Pretraga..." className="w-80" />
          <Button variant="outline">
            <SearchIcon />
          </Button>
        </ButtonGroup>
        <Button variant="ghost" className="ml-5">
          <HeadsetIcon className="size-5" />
          Podrška
        </Button>
      </div>
      <div className="flex items-center gap-5">
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
