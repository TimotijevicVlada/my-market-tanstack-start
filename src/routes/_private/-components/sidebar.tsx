import { ListIcon, UserIcon, UsersIcon } from 'lucide-react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/custom/Button'

export const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="flex flex-col align-start gap-2">
      <Button
        variant={location.pathname === '/profile' ? 'default' : 'ghost'}
        className="justify-start"
        onClick={() => navigate({ to: '/profile' })}
        size="lg"
      >
        <UserIcon />
        Moj profil
      </Button>
      <Button
        variant={location.pathname === '/categories' ? 'default' : 'ghost'}
        className="justify-start"
        onClick={() => navigate({ to: '/categories' })}
        size="lg"
      >
        <ListIcon />
        Kategorije
      </Button>
      <Button
        variant={location.pathname === '/users' ? 'default' : 'ghost'}
        className="justify-start"
        onClick={() => navigate({ to: '/users' })}
        size="lg"
      >
        <UsersIcon />
        Korisnici
      </Button>
    </div>
  )
}
