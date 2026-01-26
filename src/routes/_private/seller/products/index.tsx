import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TableSearch } from '@/components/custom/TableSearch'

export const Route = createFileRoute('/_private/seller/products/')({
  component: SellerProductsPage,
})

function SellerProductsPage() {
  const navigate = useNavigate()

  const handleSearch = () => {}

  return (
    <div>
      <h1 className="text-xl font-bold">Moji proizvodi</h1>
      <div className="flex justify-between items-center my-4">
        <div className="flex items-center gap-2">
          <TableSearch onSearchClick={handleSearch} />
        </div>
        <Button onClick={() => navigate({ to: '/seller/products/create' })}>
          <PlusIcon />
          Kreiraj proizvod
        </Button>
      </div>
    </div>
  )
}
