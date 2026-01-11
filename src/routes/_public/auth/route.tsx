import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/auth')({
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 bg-sidebar flex justify-center items-center">
        Left side
      </div>
      <div className="flex-1 flex justify-center items-center">
        <Outlet />
      </div>
    </div>
  )
}
