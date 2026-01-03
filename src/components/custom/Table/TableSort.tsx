import { ArrowDownAZIcon, ArrowUpAZIcon, ArrowUpDownIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TableSortProps<T> {
  sort: {
    key: keyof T
    order: 'asc' | 'desc'
  }
  columnKey: keyof T
  handleSort: (key: keyof T) => void
}

export const TableSort = <T,>({
  sort,
  columnKey,
  handleSort,
}: TableSortProps<T>) => {
  return (
    <Button
      variant="ghost"
      aria-label="Open menu"
      size="icon-sm"
      onClick={() => handleSort(columnKey)}
    >
      {sort.key === columnKey ? (
        sort.order === 'asc' ? (
          <ArrowDownAZIcon className="w-3.5 h-3.5 text-primary" />
        ) : (
          <ArrowUpAZIcon className="w-3.5 h-3.5 text-primary" />
        )
      ) : (
        <ArrowUpDownIcon className="w-3.5 h-3.5 text-muted-foreground" />
      )}
    </Button>
  )
}
