import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/categories/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(private)/categories/"!</div>
}
