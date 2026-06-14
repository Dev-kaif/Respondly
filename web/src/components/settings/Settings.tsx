import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import {
  AlertTriangle,
  KeyRound,
  Laptop,
  Loader2,
  Monitor,
  Moon,
  ShieldCheck,
  Smartphone,
  Sun,
  Trash2,
  User,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/src/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/src/components/ui/field'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import { useDeleteAccount } from '@/src/hooks/user-delete-user'
import { authClient } from '@/src/lib/auth'
import { cn } from '@/src/lib/utils'
import { DeleteUserDialog } from './delete-user-dialog'

type ThemeValue = 'light' | 'dark' | 'system'
type AuthSession = NonNullable<(typeof authClient.$Infer)['Session']>
type CurrentUser = AuthSession['user']
type CurrentSession = AuthSession['session']
type ListedSession = CurrentSession
type ProfileFormValues = {
  name: string
}
type PasswordFormValues = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const profileSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required.'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters.'),
    confirmPassword: z.string().min(1, 'Confirm password is required.'),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: 'Confirm password must match the new password.',
    path: ['confirmPassword'],
  })

export function getInitials(name?: string | null) {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? []

  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0]?.slice(0, 1).toUpperCase() ?? '?'

  return `${parts[0]?.slice(0, 1) ?? ''}${parts[1]?.slice(0, 1) ?? ''}`.toUpperCase()
}

export function getDeviceLabel(userAgent?: string | null) {
  if (!userAgent) return 'Unknown device'

  const normalized = userAgent.toLowerCase()
  const browser = normalized.includes('edg/')
    ? 'Edge'
    : normalized.includes('chrome/')
      ? 'Chrome'
      : normalized.includes('firefox/')
        ? 'Firefox'
        : normalized.includes('safari/')
          ? 'Safari'
          : 'Browser'

  if (normalized.includes('iphone')) return `iPhone ${browser}`
  if (normalized.includes('ipad')) return `iPad ${browser}`
  if (normalized.includes('android')) return `Android ${browser}`
  if (normalized.includes('macintosh') || normalized.includes('mac os')) return `Mac ${browser}`
  if (normalized.includes('windows')) return `Windows ${browser}`
  if (normalized.includes('linux')) return `Linux ${browser}`

  return browser
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message
    if (typeof message === 'string' && message.trim().length > 0) return message
  }

  return fallback
}

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function isMobileSession(userAgent?: string | null) {
  return /android|iphone|ipad|mobile/i.test(userAgent ?? '')
}

export function useActiveSessions(currentSession?: CurrentSession | null) {
  const [sessions, setSessions] = useState<ListedSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshSessions = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authClient.listSessions()

      if (response.error) {
        const message = getErrorMessage(response.error, 'Failed to load active sessions.')
        setError(message)
        return
      }

      setSessions(Array.isArray(response.data) ? (response.data as ListedSession[]) : [])
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, 'Failed to load active sessions.'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshSessions()
  }, [refreshSessions])

  const currentSessionId = currentSession?.id

  return {
    sessions: sessions.map((session) => ({
      ...session,
      isCurrent: session.id === currentSessionId,
    })),
    isLoading,
    error,
    refreshSessions,
  }
}

export default function SettingsPage() {
  const sessionQuery = authClient.useSession()
  const session = sessionQuery.data
  const user = session?.user
  const currentSession = session?.session

  const [revokingToken, setRevokingToken] = useState<string | null>(null)

  const { setTheme, theme } = useTheme()
  const resolvedTheme = (
    theme === 'light' || theme === 'dark' || theme === 'system' ? theme : 'system'
  ) satisfies ThemeValue

  const {
    sessions,
    isLoading: isLoadingSessions,
    error: sessionsError,
    refreshSessions,
  } = useActiveSessions(currentSession)

  async function handleRevokeSession(token: string) {
    setRevokingToken(token)

    try {
      const response = await authClient.revokeSession({ token })

      if (response.error) {
        toast.error(getErrorMessage(response.error, 'Failed to revoke session.'))
        return
      }

      toast.success('Session revoked.')
      await refreshSessions()
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to revoke session.'))
    } finally {
      setRevokingToken(null)
    }
  }

  if (sessionQuery.isPending) {
    return (
      <div className="mx-auto flex min-h-96 w-full max-w-4xl items-center justify-center px-4 py-10">
        <Loader2
          className="size-5 animate-spin text-muted-foreground"
          aria-label="Loading settings"
        />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Settings unavailable</CardTitle>
            <CardDescription>Sign in to manage your account settings.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 px-5">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-normal">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your Respondly profile, preferences, and account security.
        </p>
      </div>

      <ProfileCard user={user} onSessionRefresh={sessionQuery.refetch} />

      <AppearanceCard theme={resolvedTheme} onThemeChange={(value) => setTheme(value)} />

      <SecurityCard onSessionsRefresh={refreshSessions} />

      <ActiveSessionsCard
        sessions={sessions}
        isLoading={isLoadingSessions}
        error={sessionsError}
        revokingToken={revokingToken}
        onRefresh={refreshSessions}
        onRevokeSession={handleRevokeSession}
      />

      <DangerZoneCard />
    </main>
  )
}

function ProfileCard({
  user,
  onSessionRefresh,
}: {
  user: CurrentUser
  onSessionRefresh: () => Promise<void>
}) {
  const form = useForm({
    defaultValues: {
      name: user.name,
    } satisfies ProfileFormValues,
    validators: {
      onSubmit: profileSchema,
    },
    onSubmit: async ({ value }) => {
      const trimmedName = value.name.trim()

      try {
        const response = await authClient.updateUser({ name: trimmedName })

        if (response.error) {
          toast.error(getErrorMessage(response.error, 'Failed to update profile.'))
          return
        }

        toast.success('Profile updated.')
        await onSessionRefresh()
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to update profile.'))
      }
    },
  })

  useEffect(() => {
    form.reset({ name: user.name })
  }, [form, user.name])

  return (
    <Card className="border bg-card shadow-xs">
      <CardHeader className="px-5 pt-5 sm:px-6 sm:pt-6">
        <CardTitle className="flex items-center gap-2">
          <User className="size-4" />
          Profile
        </CardTitle>
        <CardDescription>Update your personal information.</CardDescription>
      </CardHeader>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          void form.handleSubmit()
        }}
        noValidate
      >
        <CardContent className="grid gap-6 px-5 py-1 sm:grid-cols-[5rem_1fr] sm:px-6">
          <div className="size-20 overflow-hidden rounded-full border bg-muted shadow-xs">
            {user.image ? (
              <img src={user.image} alt="" className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center text-lg font-medium text-muted-foreground">
                {getInitials(user.name)}
              </div>
            )}
          </div>
          <FieldGroup className="gap-4">
            <form.Field name="name">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      autoComplete="name"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      aria-invalid={isInvalid}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )
              }}
            </form.Field>
            <Field>
              <FieldLabel htmlFor="settings-email">Email</FieldLabel>
              <Input
                id="settings-email"
                type="email"
                value={user.email}
                readOnly
                aria-readonly="true"
                className="bg-muted/50"
              />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-end px-5 py-4 sm:px-6 mt-5">
          <form.Subscribe
            selector={(state) => [
              state.canSubmit,
              state.isSubmitting,
              state.values.name.trim() !== user.name,
            ]}
          >
            {([canSubmit, isSubmitting, profileChanged]) => (
              <Button type="submit" disabled={!canSubmit || isSubmitting || !profileChanged}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : null}
                Save Changes
              </Button>
            )}
          </form.Subscribe>
        </CardFooter>
      </form>
    </Card>
  )
}

function AppearanceCard({
  theme,
  onThemeChange,
}: {
  theme: ThemeValue
  onThemeChange: (theme: ThemeValue) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="size-4" />
          Appearance
        </CardTitle>
        <CardDescription>Choose how Respondly looks on this device.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="sm:hidden">
          <Label htmlFor="settings-theme" className="mb-2">
            Theme
          </Label>
          <Select value={theme} onValueChange={(value) => onThemeChange(value as ThemeValue)}>
            <SelectTrigger id="settings-theme">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="hidden grid-cols-3 gap-2 sm:grid">
          <ThemeButton
            icon={Sun}
            label="Light"
            active={theme === 'light'}
            onClick={() => onThemeChange('light')}
          />
          <ThemeButton
            icon={Moon}
            label="Dark"
            active={theme === 'dark'}
            onClick={() => onThemeChange('dark')}
          />
          <ThemeButton
            icon={Monitor}
            label="System"
            active={theme === 'system'}
            onClick={() => onThemeChange('system')}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function ThemeButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex h-24 flex-col items-center justify-center gap-2 rounded-lg border bg-background text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
        active && 'border-primary bg-primary/5 text-primary',
      )}
    >
      <Icon className="size-5" />
      <span className="font-medium">{label}</span>
    </button>
  )
}

function SecurityCard({ onSessionsRefresh }: { onSessionsRefresh: () => Promise<void> }) {
  const form = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    } satisfies PasswordFormValues,
    validators: {
      onSubmit: passwordSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await authClient.changePassword({
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
          revokeOtherSessions: true,
        })

        if (response.error) {
          toast.error(getErrorMessage(response.error, 'Failed to change password.'))
          return
        }

        toast.success('Password changed. Other sessions were revoked.')
        form.reset()
        await onSessionsRefresh()
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to change password.'))
      }
    },
  })

  return (
    <Card className="border bg-card shadow-xs">
      <CardHeader className="px-5 pt-5 sm:px-6 sm:pt-6">
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="size-4" />
          Security
        </CardTitle>
        <CardDescription>Change your password and revoke other sessions.</CardDescription>
      </CardHeader>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          void form.handleSubmit()
        }}
        noValidate
      >
        <CardContent className="px-5 py-1 sm:px-6">
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <form.Field name="currentPassword">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0

                return (
                  <Field className="sm:col-span-2" data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Current Password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      autoComplete="current-password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      aria-invalid={isInvalid}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="newPassword">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      autoComplete="new-password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      aria-invalid={isInvalid}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="confirmPassword">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      autoComplete="new-password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      aria-invalid={isInvalid}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )
              }}
            </form.Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-end px-5 py-4 sm:px-6 mt-5">
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : <KeyRound />}
                Update Password
              </Button>
            )}
          </form.Subscribe>
        </CardFooter>
      </form>
    </Card>
  )
}

function ActiveSessionsCard({
  sessions,
  isLoading,
  error,
  revokingToken,
  onRefresh,
  onRevokeSession,
}: {
  sessions: Array<ListedSession & { isCurrent: boolean }>
  isLoading: boolean
  error: string | null
  revokingToken: string | null
  onRefresh: () => Promise<void>
  onRevokeSession: (token: string) => Promise<void>
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Laptop className="size-4" />
          Active Sessions
        </CardTitle>
        <CardDescription>Review devices signed in to your account.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2 rounded-lg border p-4 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading sessions
          </div>
        ) : error ? (
          <div className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive sm:flex-row sm:items-center sm:justify-between">
            <span>{error}</span>
            <Button type="button" variant="outline" size="sm" onClick={() => void onRefresh()}>
              Retry
            </Button>
          </div>
        ) : (
          <div className="divide-y rounded-lg border">
            {sessions.map((session) => {
              const DeviceIcon = isMobileSession(session.userAgent) ? Smartphone : Laptop

              return (
                <div
                  key={session.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="rounded-lg bg-muted p-2 text-muted-foreground">
                      <DeviceIcon className="size-4" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{getDeviceLabel(session.userAgent)}</p>
                        {session.isCurrent ? (
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            Current
                          </span>
                        ) : null}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Created {formatDate(session.createdAt)}
                      </p>
                    </div>
                  </div>
                  {!session.isCurrent ? (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="w-full sm:w-auto"
                      onClick={() => void onRevokeSession(session.token)}
                      disabled={revokingToken === session.token}
                    >
                      {revokingToken === session.token ? (
                        <Loader2 className="animate-spin" />
                      ) : null}
                      Revoke Session
                    </Button>
                  ) : null}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function DangerZoneCard() {
  const navigate = useNavigate()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const deleteAccountMutation = useDeleteAccount()

  async function handleDeleteAccount() {
    try {
      await deleteAccountMutation.mutateAsync()

      await authClient.signOut()

      navigate({ to: '/' })
    } catch {
      toast.error('Failed to delete account')
    }
  }

  return (
    <>
      <DeleteUserDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteAccount}
        isPending={deleteAccountMutation.isPending}
      />
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-4" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <p className="font-medium">Delete Account</p>

                <p className="text-sm text-muted-foreground">
                  This action cannot be undone. All forms, questions, responses, answers, sessions,
                  and account data will be permanently removed.
                </p>
              </div>

              <Button type="button" variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                <Trash2 />
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
