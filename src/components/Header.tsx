import { ModeToggle } from './mode-toggle'

export default function Header() {
  return (
    <header className="h-14 flex items-center justify-between bg-secondary px-20 border-b border-border">
      <div>
        <img src="/public/logo.png" alt="Logo" className="h-9" />
      </div>
      <div className="flex items-center justify-end">
        <ModeToggle />
      </div>
    </header>
  )
}
