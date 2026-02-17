import { GalleryVerticalEnd } from 'lucide-react'
import { Link, Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import Header from '@/layout/Header'
import { getSessionUser } from '@/api/auth/server'

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
  beforeLoad: async () => {
    const sessionUser = await getSessionUser()
    if (sessionUser.user) {
      throw redirect({ to: '/', replace: true })
    }
  },
})

function AuthLayout() {
  return (
    <div>
      <Header />
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 self-center font-medium"
          >
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            My Marketplace
          </Link>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
