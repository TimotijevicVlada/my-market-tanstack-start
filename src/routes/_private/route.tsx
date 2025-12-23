import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Sidebar } from './-components/sidebar'

export const Route = createFileRoute('/_private')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen flex">
      <div className="w-75 bg-sidebar p-4">
        <Sidebar />
      </div>
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  )
}
