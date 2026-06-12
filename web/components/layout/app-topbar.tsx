import { useRouterState } from '@tanstack/react-router'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/forms': 'Forms',
}

export function AppTopbar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const title = pathname.startsWith('/forms/')
    ? 'Form Editor'
    : (pageTitles[pathname] ?? 'Survey Builder')

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center border-b bg-background/90 px-6 backdrop-blur">
      <h1 className="text-base font-semibold">{title}</h1>
    </header>
  )
}
