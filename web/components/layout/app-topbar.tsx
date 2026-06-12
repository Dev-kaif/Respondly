import { useRouterState } from '@tanstack/react-router'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/forms': 'Forms',
}

export function AppTopbar() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  let title = pageTitles[pathname] ?? 'Survey Builder'

  if (pathname.includes('/responses')) {
    title = 'Responses'
  } else if (pathname.startsWith('/builder/')) {
    title = 'Form Editor'
  } else if (pathname.startsWith('/forms/')) {
    title = 'Forms'
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center border-b bg-background/90 px-6 backdrop-blur">
      <h1 className="text-base font-semibold">{title}</h1>
    </header>
  )
}
