import { createFileRoute, redirect } from '@tanstack/react-router'
import { authClient } from '@/lib/auth'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const session = await authClient.getSession()

    throw redirect({ to: session.data ? '/dashboard' : '/auth/login' })
  },
})
