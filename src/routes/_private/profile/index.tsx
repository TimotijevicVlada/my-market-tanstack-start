import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/profile/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>CAOS PROFILE</div>
}
