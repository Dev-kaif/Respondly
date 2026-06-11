import { authClient } from '../../lib/auth'
import { redirect } from '@tanstack/react-router'

export const Protection = async () => {
    const session = await authClient.getSession()

    if (!session.data) {
        throw redirect({ to: '/auth/login' })
    }
}