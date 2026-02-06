import { EmptyData } from '../EmptyData'
import type { EmptyDataProps } from '../EmptyData'
import { TableCell, TableRow } from '@/components/ui/table'

interface TableEmptyHolderProps extends EmptyDataProps {
  colSpan: number
}

export const TableEmptyHolder = ({
  colSpan,
  ...rest
}: TableEmptyHolderProps) => {
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className="text-center text-muted-foreground"
      >
        <EmptyData {...rest} />
      </TableCell>
    </TableRow>
  )
}
