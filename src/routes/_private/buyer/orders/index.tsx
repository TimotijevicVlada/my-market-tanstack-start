import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/buyer/orders/')({
  component: OrdersPage,
})

function OrdersPage() {
  return <div>Orders</div>
}
