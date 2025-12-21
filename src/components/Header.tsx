import { PlusIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { ModeToggle } from './mode-toggle'
import { Button } from './ui/button'

export default function Header() {
  return (
    <header className="h-14 flex items-center justify-between bg-secondary px-20 border-b border-border">
      <div>
        <Link to="/" className="cursor-pointer">
          <img src="/logo.png" alt="Logo" className="h-9" />
        </Link>
      </div>
      <div className="flex items-center gap-5">
        <Link to="/login">
          <Button variant="ghost">Prijavi se</Button>
        </Link>
        <Link to="/register">
          <Button>Registruj se</Button>
        </Link>
        <Button asChild>
          <Link to="/create-category">
            <PlusIcon className="h-4 w-4" />
            Kreiraj kategoriju
          </Link>
        </Button>
        <ModeToggle />
      </div>
    </header>
  )
}
