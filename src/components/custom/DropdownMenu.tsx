import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenu as DropdownMenuUI,
} from '../ui/dropdown-menu'

interface DropdownMenuProps<T> {
  options: Array<T>
  handleOptionChange: (option: T) => void
  triggerButton: React.ReactNode
  labelKey: keyof T
  active?: {
    key: keyof T
    value: string | null
  }
}

export const DropdownMenu = <T extends { id: string }>({
  options,
  handleOptionChange,
  triggerButton,
  labelKey,
  active,
}: DropdownMenuProps<T>) => {
  return (
    <DropdownMenuUI modal={false}>
      <DropdownMenuTrigger asChild>{triggerButton}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuGroup className="flex flex-col gap-1">
          {options.map((option) => (
            <DropdownMenuItem
              key={option.id}
              onSelect={() => handleOptionChange(option)}
              className={
                active?.key && option[active.key] === active.value
                  ? 'bg-accent text-accent-foreground'
                  : ''
              }
            >
              {option[labelKey] as string}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenuUI>
  )
}
