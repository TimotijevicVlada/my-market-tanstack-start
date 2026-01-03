import { Spinner } from '@/components/ui/spinner'

interface TableLoadingProps {
  label: string
}

export const TableLoading = ({ label }: TableLoadingProps) => {
  return (
    <div className="flex justify-center items-center gap-2 mt-70">
      <Spinner className="w-7 h-7" />
      <span className="text-lg">{label}</span>
    </div>
  )
}
