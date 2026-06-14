import { createFileRoute, redirect } from '@tanstack/react-router'

import { AuthForm } from '@/src/components/auth/auth-form'
import { authClient } from '@/src/lib/auth'

export const Route = createFileRoute('/auth/signup')({
  beforeLoad: async () => {
    const session = await authClient.getSession()

    if (session.data) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: SignupRoute,
})

function SignupRoute() {
  return <AuthForm mode="signup" />
}
