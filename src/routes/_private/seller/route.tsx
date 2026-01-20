import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/seller')({
  component: SellerLayout,
  beforeLoad: async () => {
   // TODO: Add before load
  },
})

function SellerLayout() {
  return <Outlet />
}
