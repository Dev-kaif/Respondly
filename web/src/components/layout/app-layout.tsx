import { Outlet } from '@tanstack/react-router'

import { AppSidebar } from '@/src/components/layout/app-sidebar'
import { AppTopbar } from '@/src/components/layout/app-topbar'
import { authClient } from '@/src/lib/auth'

export function AppLayout() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <main className="grid min-h-svh place-items-center bg-muted/30 px-4">
        <div className="flex flex-col gap-2">
          <img className="h-12" src="/loader.svg" alt="" />
          <img className="h-8" src="/logo.png" alt="" />
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
