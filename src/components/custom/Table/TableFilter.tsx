import { FilterIcon } from 'lucide-react'
import { DropdownMenu } from '../DropdownMenu'
import type { DropdownMenuProps } from '../DropdownMenu'
import { Button } from '@/components/ui/button'
import { TableHead } from '@/components/ui/table'

interface TableFilterProps<T> {
  label: string
  dropdownProps: Omit<DropdownMenuProps<T>, 'triggerButton'>
}

export const TableFilter = <T extends { id: string }>({
  label,
  dropdownProps,
}: TableFilterProps<T>) => {
  const { options, handleOptionChange, labelKey, active } = dropdownProps

  return (
    <TableHead {...options} className="flex items-center gap-2">
      {label}
      <DropdownMenu
        options={options}
        handleOptionChange={handleOptionChange}
        labelKey={labelKey}
        active={{ key: 'id', value: active?.value ?? null }}
        triggerButton={
          <Button variant="ghost" aria-label="Open menu" size="icon-sm">
            <FilterIcon
              className={`text-${active?.value ? 'primary' : 'muted-foreground'}`}
            />
          </Button>
        }
      />
    </TableHead>
  )
}
