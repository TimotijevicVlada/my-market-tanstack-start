import {
  Outlet,
  createFileRoute,
  redirect,
  useLoaderData,
} from '@tanstack/react-router'
import { getLoggedInUser } from '@/api/auth/server'
import Header from '@/layout/Header'

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
  beforeLoad: async () => {
    const user = await getLoggedInUser()
    if (user) {
      throw redirect({ to: '/' })
    }
  },
  loader: async () => {
    const user = await getLoggedInUser()
    return { user }
  },
})

function AuthLayout() {
  const { user } = useLoaderData({ from: '/_auth' })

  return (
    <div>
      <Header initialUser={user} />
      <div className="min-h-screen flex">
        <div className="flex-1 bg-sidebar flex justify-center items-center">
          Left side
        </div>
        <div className="flex-1 flex justify-center items-center">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
