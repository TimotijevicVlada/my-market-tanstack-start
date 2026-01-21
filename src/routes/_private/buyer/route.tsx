import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/buyer')({
  component: BuyerLayout,
  beforeLoad: async () => {
   // TODO: Add before load
  },
})

function BuyerLayout() {
  return <Outlet />
}
