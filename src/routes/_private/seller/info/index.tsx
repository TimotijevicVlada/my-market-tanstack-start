import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/seller/info/')({
  component: SellerInfoPage,
})

function SellerInfoPage() {
  return <div>Seller info</div>
}
