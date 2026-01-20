import { Outlet, createFileRoute } from '@tanstack/react-router'
import Header from '@/layout/Header'

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div>
      <Header />
      <div className="min-h-screen flex">
        <div className="flex-1 bg-sidebar flex justify-center items-center">
          Left side
        </div>
        <div className="flex-1 flex justify-center items-center">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
