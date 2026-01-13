import { Outlet, createFileRoute, useLoaderData } from '@tanstack/react-router'
import Header from '@/layout/Header'
import { getLoggedInUser } from '@/api/auth/server'

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
  loader: async () => {
    const user = await getLoggedInUser()
    return { user }
  },
})

function PublicLayout() {
  const { user } = useLoaderData({ from: '/_public' })

  return (
    <div className="min-h-screen">
      <Header initialUser={user} />
      <Outlet />
    </div>
  )
}
