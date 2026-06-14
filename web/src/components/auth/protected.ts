import { redirect } from '@tanstack/react-router'
import { authClient } from '@/src/lib/auth'

export const Protection = async () => {
  const session = await authClient.getSession()

  if (!session.data) {
    throw redirect({ to: '/auth/login' })
  }
}
