import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { getLoggedInUser } from '@/api/auth/server'

export const Route = createFileRoute('/_private/seller')({
  component: SellerLayout,
  beforeLoad: async () => {
    const user = await getLoggedInUser()
    if (user?.role !== 'seller') {
      throw redirect({ to: '/account' })
    }
    return { user }
  },
})

function SellerLayout() {
  return <Outlet />
}
