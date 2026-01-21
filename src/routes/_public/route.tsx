import { Outlet, createFileRoute, useLoaderData } from '@tanstack/react-router'
import Header from '@/layout/Header'
import { getSessionUser } from '@/api/auth/server'
import { useGetSessionUser } from '@/api/auth/queries'

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
  loader: async () => await getSessionUser()
})

function PublicLayout() {

  const { user } = useLoaderData({ from: '/_public' })
  const { data: sessionUser } = useGetSessionUser(user)

  return (
    <div className="min-h-screen">
      <Header sessionUser={sessionUser} />
      <div className="py-5">
        <Outlet />
      </div>
    </div>
  )
}
