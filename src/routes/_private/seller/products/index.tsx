import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_private/seller/products/')({
  component: SellerProductsPage,
})

function SellerProductsPage() {

  const navigate = useNavigate()
  return (
    <div>
      <h1>Moji proizvodi</h1>
      <Button onClick={() => navigate({ to: '/seller/products/create' })}>
        <PlusIcon />
        Kreiraj proizvod
      </Button>
    </div>
  )
}
