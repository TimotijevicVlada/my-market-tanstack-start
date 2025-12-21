import { Monitor, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useThemeStore } from '@/zustand/theme'

type Theme = 'light' | 'dark' | 'system'

export function ThemeModeDropdown() {
  const { setThemeMode } = useThemeStore()

  const handleThemeChange = (newTheme: Theme) => {
    setThemeMode(newTheme)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onSelect={() => handleThemeChange('light')}>
          <Sun />
          Svetla
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleThemeChange('dark')}>
          <Moon />
          Tamna
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleThemeChange('system')}>
          <Monitor />
          Sistemska
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
