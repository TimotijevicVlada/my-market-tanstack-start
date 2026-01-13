import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/seller/products/')({
  component: SellerProductsPage,
})

function SellerProductsPage() {
  return <div>Moji proizvodi</div>
}
