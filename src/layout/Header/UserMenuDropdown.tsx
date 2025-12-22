import { ChevronDownIcon, LogOutIcon, UserIcon } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import type { User } from '@/api/middleware/types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { removeAuthToken } from '@/lib/auth'
import { useLoggedInUser } from '@/api/auth/queries'

interface UserMenuDropdownProps {
  loggedInUser: User
}

export const UserMenuDropdown = ({ loggedInUser }: UserMenuDropdownProps) => {
  const { refetch: refetchLoggedInUser } = useLoggedInUser({
    initialData: loggedInUser,
  })
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
        <Button variant="ghost">
          {loggedInUser.username}
          <Badge className="text-[0.7rem] py-0.3 font-bold">
            {loggedInUser.role.toUpperCase()}
          </Badge>
          <ChevronDownIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuItem onClick={() => navigate({ to: '/profile' })}>
          <UserIcon />
          Moj profil
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
