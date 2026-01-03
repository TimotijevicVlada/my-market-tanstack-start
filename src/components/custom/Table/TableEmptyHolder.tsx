import { EmptyData } from '../EmptyData'
import { TableCell, TableRow } from '@/components/ui/table'

interface TableEmptyHolderProps {
  colSpan: number
  title: string
}

export const TableEmptyHolder = ({ colSpan, title }: TableEmptyHolderProps) => {
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className="text-center text-muted-foreground"
      >
        <EmptyData title={title} />
      </TableCell>
    </TableRow>
  )
}
