import { createFileRoute } from '@tanstack/react-router'

import { Protection } from '@/src/components/auth/protected'
import { AppLayout } from '@/src/components/layout/app-layout'

export const Route = createFileRoute('/_app')({
  beforeLoad: Protection,
  component: AppLayout,
})
