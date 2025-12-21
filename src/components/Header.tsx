import { LogOutIcon, PlusIcon } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { ModeToggle } from './mode-toggle'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import type { User } from '@/api/middleware/types'
import { useLoggedInUser } from '@/api/auth/queries'
import { removeAuthToken } from '@/lib/auth'

interface HeaderProps {
  initialUser: User | null
}

export default function Header({ initialUser }: HeaderProps) {
  const { data: loggedInUser, refetch: refetchLoggedInUser } = useLoggedInUser({
    initialData: initialUser,
  })
  const navigate = useNavigate()

  const handleLogout = () => {
    removeAuthToken()
    refetchLoggedInUser()
    navigate({ to: '/' })
    toast.success('Uspešno ste se odjavili')
  }

  return (
    <header className="h-14 flex items-center justify-between bg-secondary px-20 border-b border-border">
      <div>
        <Link to="/" className="cursor-pointer">
          <img src="/logo.png" alt="Logo" className="h-9" />
        </Link>
      </div>
      <div className="flex items-center gap-5">
        <ModeToggle />
        {loggedInUser ? (
          <div className="flex gap-2 items-center">
            {loggedInUser.username}
            <Badge>{loggedInUser.role.toUpperCase()}</Badge>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOutIcon className="h-4 w-4" />
            </Button>
            <Button asChild>
              <Link to="/create-category">
                <PlusIcon className="h-4 w-4" />
                Kreiraj kategoriju
              </Link>
            </Button>
          </div>
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
