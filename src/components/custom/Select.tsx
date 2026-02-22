import { useState } from 'react'
import { Check, ChevronsUpDown, XIcon } from 'lucide-react'
import { Label } from '../ui/label'
import { FieldDescription } from '../ui/field'
import { Button } from './Button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface SelectProps<T> {
  options: Array<T>
  label?: string
  placeholder: string
  value: T[keyof T] | null
  keys: {
    label: keyof T
    value: keyof T
  }
  onSelect: (value: T | null) => void
  required?: boolean
  error?: string
  description?: string
  disabled?: boolean
}

export const Select = <T extends { id: string }>({
  options,
  label,
  placeholder,
  value,
  keys,
  onSelect,
  required = false,
  error,
  description,
  disabled = false,
}: SelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      {label && (
        <Label className="mb-2">
          {label}
          {required && <span className="text-destructive font-bold">*</span>}
        </Label>
      )}
      <Popover open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="w-full justify-between"
            type="button"
          >
            {value ? (
              (options.find((opt) => opt.id === value)?.[keys.label] as string)
            ) : (
              <span className="text-muted-foreground font-normal">
                {placeholder}
              </span>
            )}
            <div className="flex items-center gap-2">
              {value && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="w-7 h-7"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelect(null)
                  }}
                >
                  <XIcon className="size-4 opacity-50" />
                </Button>
              )}
              <ChevronsUpDown className="opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder="Pretraga opcija..." className="h-9" />
            <CommandList
              className="max-h-[300px]"
              onWheel={(e) => e.stopPropagation()}
            >
              <CommandEmpty>Nema opcija.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.id}
                    value={option[keys.label] as string}
                    onSelect={() => {
                      onSelect(option)
                      setIsOpen(false)
                    }}
                  >
                    {option[keys.label] as string}
                    <Check
                      className={cn(
                        'ml-auto',
                        value === option[keys.value]
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {description && (
        <FieldDescription className="text-xs text-muted-foreground">
          {description}
        </FieldDescription>
      )}
      {error && (
        <FieldDescription className="text-destructive">
          {error}
        </FieldDescription>
      )}
    </div>
  )
}
