import { createFileRoute, redirect } from '@tanstack/react-router'
import { getLoggedInUser } from '@/api/auth/server'

export const Route = createFileRoute('/_private/account/orders/')({
  component: OrdersPage,
  beforeLoad: async () => {
    const user = await getLoggedInUser()
    if (user?.role.includes('admin')) {
      throw redirect({ to: '/account' })
    }
    return { user }
  },
})

function OrdersPage() {
  return <div>My orders</div>
}
