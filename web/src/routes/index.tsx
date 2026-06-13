import { createFileRoute, redirect } from '@tanstack/react-router'
import { authClient } from '@/lib/auth'
import { LandingPage } from '@/src/components/LandingPage'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const session = await authClient.getSession()
    if (session.data) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: LandingPage,
})
