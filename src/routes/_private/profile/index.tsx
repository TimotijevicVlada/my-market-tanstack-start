import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/profile/')({
  component: ProfileComponent,
})

function ProfileComponent() {
  return <div>PROFILE PAGE</div>
}
