import { Link } from '@tanstack/react-router'
import { ThemeModeDropdown } from './ThemeModeDropdown'
import { UserMenuDropdown } from './UserMenuDropdown'
import type { User } from '@/api/middleware/types'
import { useLoggedInUser } from '@/api/auth/queries'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  initialUser: User | null
}

export default function Header({ initialUser }: HeaderProps) {
  const { data: loggedInUser } = useLoggedInUser({
    initialData: initialUser,
  })

  return (
    <header className="h-14 flex items-center justify-between bg-secondary px-20 border-b border-border">
      <div>
        <Link to="/" className="cursor-pointer">
          <img src="/logo.png" alt="Logo" className="h-9" />
        </Link>
      </div>
      <div className="flex items-center gap-5">
        <ThemeModeDropdown />
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
