import { createFileRoute } from '@tanstack/react-router'
import SettingsPage from '@/src/components/settings/Settings'

export const Route = createFileRoute('/_app/settings')({
  component: Settings,
})

function Settings() {
  return (
    <div className="px-20 py-5">
      <SettingsPage />
    </div>
  )
}
