import { TriangleAlertIcon } from 'lucide-react'

interface TableErrorProps {
  error: string | undefined
}

export const TableError = ({ error }: TableErrorProps) => {
  return (
    <div className="flex justify-center items-center gap-2 mt-70">
      <TriangleAlertIcon className="w-7 h-7 text-destructive" />
      <span className="text-lg text-destructive">{error}</span>
    </div>
  )
}
