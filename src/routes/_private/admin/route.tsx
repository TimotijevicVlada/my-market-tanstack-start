import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { getLoggedInUser } from '@/api/auth/server'

export const Route = createFileRoute('/_private/admin')({
  component: AdminLayout,
  beforeLoad: async () => {
    const user = await getLoggedInUser()
    if (user?.role !== 'admin') {
      throw redirect({ to: '/account' })
    }
    return { user }
  },
})

function AdminLayout() {
  return <Outlet />
}
