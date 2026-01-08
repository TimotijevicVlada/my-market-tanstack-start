import { ListIcon, StoreIcon, UserIcon, UsersIcon } from 'lucide-react'
import { Link, useLocation } from '@tanstack/react-router'
import { Button } from '@/components/custom/Button'

export const Sidebar = () => {
  const location = useLocation()

  const getButtonVariant = (path: string) => {
    return location.pathname === path ? 'default' : 'ghost'
  }

  return (
    <div className="flex flex-col gap-2">
      <Link to="/profile" search={{ tab: 'profile' }}>
        <Button
          variant={getButtonVariant('/profile')}
          className="justify-start w-full"
          size="lg"
        >
          <UserIcon />
          Moj profil
        </Button>
      </Link>

      <Link to="/categories">
        <Button
          variant={getButtonVariant('/categories')}
          className="justify-start w-full"
          size="lg"
        >
          <ListIcon />
          Kategorije
        </Button>
      </Link>
      <Link to="/users">
        <Button
          variant={getButtonVariant('/users')}
          className="justify-start w-full"
          size="lg"
        >
          <UsersIcon />
          Korisnici
        </Button>
      </Link>
      <Link to="/sellers">
        <Button
          variant={getButtonVariant('/sellers')}
          className="justify-start w-full"
          size="lg"
        >
          <StoreIcon />
          Prodavci
        </Button>
      </Link>
    </div>
  )
}
