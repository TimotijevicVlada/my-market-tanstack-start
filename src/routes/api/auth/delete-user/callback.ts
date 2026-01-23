import { createFileRoute } from '@tanstack/react-router'
import { auth } from '@/lib/auth'

export const Route = createFileRoute('/api/auth/delete-user/callback')({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        return await auth.handler(request)
      },
      POST: async ({ request }: { request: Request }) => {
        return await auth.handler(request)
      },
    },
  },
})
