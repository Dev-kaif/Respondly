import { createFileRoute } from '@tanstack/react-router'
import { LandingPage } from '@/src/components/LandingPage'

export const Route = createFileRoute('/')({
  component: LandingPage,
})
