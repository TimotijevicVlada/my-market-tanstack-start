import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Sidebar } from './-components/sidebar'

export const Route = createFileRoute('/_private')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen flex overflow-hidden">
      <div className="w-70 bg-sidebar p-4 flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 p-4 min-w-0 overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}
