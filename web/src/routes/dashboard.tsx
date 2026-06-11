import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { LogOut, UserRound } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authClient } from '@/lib/auth'
import {Protection}from '@/components/auth/protected'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: Protection,
  component: DashboardRoute,
})

function DashboardRoute() {
  const navigate = useNavigate()
  const { data: session, isPending, refetch } = authClient.useSession()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState<string | null>(null)

  async function handleLogout() {
    setIsLoggingOut(true)
    setLogoutError(null)

    try {
      const response = await authClient.signOut()

      if (response.error) {
        setLogoutError(response.error.message ?? 'Unable to sign out. Please try again.')
        return
      }

      await refetch()
      await navigate({ to: '/auth/login' })
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : 'Unable to sign out. Please try again.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (isPending) {
    return (
      <main className="grid min-h-svh place-items-center bg-muted/30 px-4">
        <Card className="w-full max-w-sm">
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Loading your workspace...
          </CardContent>
        </Card>
      </main>
    )
  }

  if (!session) {
    return (
      <main className="grid min-h-svh place-items-center bg-muted/30 px-4">
        <Card className="w-full max-w-sm">
          <CardContent className="space-y-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">Your session has expired.</p>
            <Button onClick={() => void navigate({ to: '/auth/login' })}>Sign in</Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-svh bg-muted/30">
      <header className="border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Survey Builder</p>
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
          <Button variant="outline" onClick={handleLogout} disabled={isLoggingOut}>
            <LogOut />
            {isLoggingOut ? 'Signing out' : 'Logout'}
          </Button>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 md:grid-cols-[1fr_20rem]">
        <section className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Welcome, {session.user.name ?? 'there'}</CardTitle>
              <CardDescription>Your authenticated workspace is ready.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border bg-background p-4">
                  <p className="text-sm text-muted-foreground">Surveys</p>
                  <p className="mt-2 text-2xl font-semibold">0</p>
                </div>
                <div className="rounded-lg border bg-background p-4">
                  <p className="text-sm text-muted-foreground">Responses</p>
                  <p className="mt-2 text-2xl font-semibold">0</p>
                </div>
                <div className="rounded-lg border bg-background p-4">
                  <p className="text-sm text-muted-foreground">Completion</p>
                  <p className="mt-2 text-2xl font-semibold">--</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {logoutError ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {logoutError}
            </div>
          ) : null}
        </section>

        <Card>
          <CardHeader>
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <UserRound className="size-5" />
            </div>
            <CardTitle>Current user</CardTitle>
            <CardDescription>Session details from Better Auth.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-medium">{session.user.name ?? 'Not provided'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="break-all font-medium">{session.user.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground">User ID</p>
              <p className="break-all font-mono text-xs">{session.user.id}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
