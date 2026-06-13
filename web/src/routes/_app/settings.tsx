import { createFileRoute } from '@tanstack/react-router'
import SettingsPage from '@/src/components/settings/Settings'

export const Route = createFileRoute('/_app/settings')({
  component: SettingsPage,
})
