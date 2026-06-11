import { createFileRoute } from '@tanstack/react-router'

import { Protection } from '@/components/auth/protected'
import { AppLayout } from '@/components/layout/app-layout'

export const Route = createFileRoute('/_app')({
  beforeLoad: Protection,
  component: AppLayout,
})
