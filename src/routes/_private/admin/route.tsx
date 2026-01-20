import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/admin')({
  component: AdminLayout,
  beforeLoad: async () => {
   // TODO: Add before load
  },
})

function AdminLayout() {
  return <Outlet />
}
