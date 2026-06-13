import { useForm } from '@tanstack/react-form'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth'

const loginSchema = z.object({
  name: z.string(),
  email: z.email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
})

const signupSchema = loginSchema.extend({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
})

type AuthMode = 'login' | 'signup'
type AuthFormValues = {
  name: string
  email: string
  password: string
}

function getErrorMessage(error: unknown) {
  if (!error) return 'Something went wrong. Please try again.'

  if (typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message
    if (typeof message === 'string' && message.length > 0) {
      return message
    }
  }

  return 'Something went wrong. Please try again.'
}

export function AuthForm({ mode }: { mode: AuthMode }) {
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)

  const isSignup = mode === 'signup'

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    } satisfies AuthFormValues,
    validators: {
      onSubmit: isSignup ? signupSchema : loginSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null)

      try {
        const response = isSignup
          ? await authClient.signUp.email({
              name: value.name,
              email: value.email,
              password: value.password,
            })
          : await authClient.signIn.email({
              email: value.email,
              password: value.password,
            })

        if (response.error) {
          setFormError(getErrorMessage(response.error))
          return
        }

        await navigate({ to: '/dashboard' })
      } catch (error) {
        setFormError(getErrorMessage(error))
      }
    },
  })

  return (
    <main className="min-h-svh bg-[radial-gradient(circle_at_top_left,oklch(0.92_0.08_210),transparent_32rem),linear-gradient(180deg,oklch(0.99_0.01_220),oklch(0.96_0.02_250))] px-4 py-10 text-foreground">
      <div className="mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full gap-8 md:grid-cols-[1fr_24rem] md:items-center">
          <section className="hidden space-y-5 md:block">
            <div className="inline-flex rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground shadow-xs backdrop-blur">
              Respondly
            </div>
            <div className="max-w-xl space-y-3">
              <h1 className="text-4xl font-semibold tracking-normal text-balance">
                Build research workflows with a secure workspace.
              </h1>
              <p className="max-w-lg text-base leading-7 text-muted-foreground">
                Sign in to manage surveys, responses, and reporting from one focused dashboard.
              </p>
            </div>
          </section>

          <Card className="w-full border bg-background/90 shadow-2xl shadow-slate-950/10 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl">
                {isSignup ? 'Create your account' : 'Welcome back'}
              </CardTitle>
              <CardDescription>
                {isSignup
                  ? 'Start with your name, email, and a secure password.'
                  : 'Use your email and password to continue.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  void form.handleSubmit()
                }}
                noValidate
              >
                <FieldGroup>
                  {isSignup ? (
                    <form.Field name="name">
                      {(field) => {
                        const isInvalid =
                          field.state.meta.isTouched && field.state.meta.errors.length > 0

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
                  ) : null}

                  <form.Field name="email">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && field.state.meta.errors.length > 0

                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            type="email"
                            autoComplete="email"
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

                  <form.Field name="password">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && field.state.meta.errors.length > 0

                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            type="password"
                            autoComplete={isSignup ? 'new-password' : 'current-password'}
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

                  {formError ? (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                      {formError}
                    </div>
                  ) : null}

                  <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                    {([canSubmit, isSubmitting]) => (
                      <Button
                        className="w-full"
                        size="lg"
                        type="submit"
                        disabled={!canSubmit || isSubmitting}
                      >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : null}
                        {isSubmitting ? 'Please wait' : isSignup ? 'Create account' : 'Sign in'}
                      </Button>
                    )}
                  </form.Subscribe>
                </FieldGroup>
              </form>
            </CardContent>
            <CardFooter className="justify-center text-sm text-muted-foreground">
              {isSignup ? 'Already have an account?' : 'New to Respondly?'}{' '}
              <Button asChild variant="link" className="h-auto px-1">
                <Link to={isSignup ? '/auth/login' : '/auth/signup'}>
                  {isSignup ? 'Sign in' : 'Create one'}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}
