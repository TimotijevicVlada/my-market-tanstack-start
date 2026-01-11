import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { getLoggedInUser } from '@/api/auth/server'

export const Route = createFileRoute('/_private/buyer')({
  component: BuyerLayout,
  beforeLoad: async () => {
    const user = await getLoggedInUser()
    if (user?.role !== 'buyer') {
      throw redirect({ to: '/account' })
    }
    return { user }
  },
})

function BuyerLayout() {
  return <Outlet />
}
