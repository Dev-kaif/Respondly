import { createFileRoute, redirect } from '@tanstack/react-router'
import { authClient } from '@/lib/auth'
import { LandingPage } from '@/src/components/LandingPage'

export const Route = createFileRoute('/')({
  component: LandingPage,
})
