import { Outlet } from '@tanstack/react-router'

import { AppSidebar } from '@/components/layout/app-sidebar'
import { AppTopbar } from '@/components/layout/app-topbar'
import { authClient } from '@/lib/auth'

export function AppLayout() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <main className="grid min-h-svh place-items-center bg-muted/30 px-4">
        <div className="rounded-lg border bg-background px-4 py-3 text-sm text-muted-foreground shadow-sm">
          Loading workspace...
        </div>
      </main>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-svh bg-muted/30">
      <AppSidebar user={session.user} />
      <div className="flex min-h-svh flex-col md:pl-68">
        <AppTopbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
