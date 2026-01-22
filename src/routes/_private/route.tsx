import {
  Outlet,
  createFileRoute,
  useLoaderData,
} from '@tanstack/react-router'
import Header from '@/layout/Header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/custom/Sidebar/app-sidebar'
import { authMiddleware } from '@/lib/middleware'
import { getSessionUser } from '@/api/auth/server'
import { useGetSessionUser } from '@/api/auth/queries'

export const Route = createFileRoute('/_private')({
  component: PrivateLayout,
  server: {
    middleware: [authMiddleware]
  },
  loader: async () => await getSessionUser()
})

function PrivateLayout() {
  const { user } = useLoaderData({ from: '/_private' })

  const { data: sessionUser } = useGetSessionUser(user)

  return (
    <SidebarProvider>
      <AppSidebar collapsible="icon" />
      <SidebarInset className="overflow-x-hidden">
        <Header privateLayout sessionUser={sessionUser} />
        <div className="p-5">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
