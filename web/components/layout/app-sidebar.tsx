import { Link, useRouterState } from '@tanstack/react-router'
import { ClipboardList, LayoutDashboard, Settings2Icon } from 'lucide-react'

import { UserMenu } from '@/components/layout/user-menu'
import { cn } from '@/lib/utils'

type AppSidebarUser = {
  name?: string | null
  email: string
  image?: string | null
}

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Forms', to: '/forms', icon: ClipboardList },
  { label: 'Settings', to: '/settings', icon: Settings2Icon },
] as const

export function AppSidebar({ user }: { user: AppSidebarUser }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-68 flex-col border-r bg-background md:flex">
      <div className="flex h-16 items-center border-b px-4">
        <Link to="/dashboard" className="flex min-w-0 items-center gap-2">
          <img className='h-10' src="/logo.png" alt="respondly" />
        </Link>
      </div>

      <nav className="flex flex-col gap-1 px-3 py-4">
        <p className="px-2 pb-2 text-xs font-medium text-muted-foreground">Navigation</p>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.to

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex h-9 items-center gap-2 rounded-lg px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                isActive && 'bg-muted text-foreground',
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="flex-1" />

      <div className="p-3">
        <UserMenu user={user} />
      </div>
    </aside>
  )
}
