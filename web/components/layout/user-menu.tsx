import { useNavigate } from '@tanstack/react-router'
import { ChevronsUpDown, LogOut } from 'lucide-react'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { authClient } from '@/lib/auth'

type UserMenuUser = {
  name?: string | null
  email: string
  image?: string | null
}

function getInitials(name: string | null | undefined, email: string) {
  const source = name?.trim() || email
  return source
    .split(/\s+|@/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function UserMenu({ user }: { user: UserMenuUser }) {
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    setIsLoggingOut(true)

    try {
      await authClient.signOut()
      await navigate({ to: '/auth/login' })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg border bg-background p-2 text-left shadow-xs outline-none transition-colors hover:bg-muted/60 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-primary text-sm font-medium text-primary-foreground">
            {user.image ? (
              <img src={user.image} alt="" className="size-full object-cover" />
            ) : (
              getInitials(user.name, user.email)
            )}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">{user.name || 'Account'}</span>
            <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="top"
        sideOffset={8}
        className="w-(--radix-dropdown-menu-trigger-width)"
      >
        <DropdownMenuLabel className="flex items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-primary text-xs font-medium text-primary-foreground">
            {user.image ? (
              <img src={user.image} alt="" className="size-full object-cover" />
            ) : (
              getInitials(user.name, user.email)
            )}
          </span>
          <span className="min-w-0">
            <span className="block truncate">{user.name || 'Account'}</span>
            <span className="block truncate text-xs font-normal text-muted-foreground">
              {user.email}
            </span>
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => void handleLogout()}
          disabled={isLoggingOut}
        >
          <LogOut />
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
