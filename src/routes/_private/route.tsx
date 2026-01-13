import {
  Outlet,
  createFileRoute,
  redirect,
  useLoaderData,
} from '@tanstack/react-router'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/custom/Sidebar/app-sidebar'
import { getLoggedInUser } from '@/api/auth/server'
import Header from '@/layout/Header'

export const Route = createFileRoute('/_private')({
  component: PrivateLayout,
  beforeLoad: async () => {
    const user = await getLoggedInUser()
    if (!user) {
      throw redirect({ to: '/login' })
    }
    return { user }
  },
  loader: async () => {
    const user = await getLoggedInUser()
    return { user }
  },
})

function PrivateLayout() {
  const { user } = useLoaderData({ from: '/_private' })

  return (
    <SidebarProvider>
      <AppSidebar collapsible="icon" />
      <SidebarInset className="overflow-x-hidden">
        <Header initialUser={user} privateLayout />
        <div className="p-5">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
