import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/account/orders/')({
  component: OrdersPage,
  beforeLoad: async () => {
  // TODO: Add before load
  },
})

function OrdersPage() {
  return <div>My orders</div>
}
