import { createFileRoute, redirect } from '@tanstack/react-router'

import { AuthForm } from '@/components/auth/auth-form'
import { authClient } from '@/lib/auth'

export const Route = createFileRoute('/auth/login')({
  beforeLoad: async () => {
    const session = await authClient.getSession()

    if (session.data) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: LoginRoute,
})

function LoginRoute() {
  return <AuthForm mode="login" />
}
