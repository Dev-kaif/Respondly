import { useForm } from '@tanstack/react-form'
import { Link, useNavigate } from '@tanstack/react-router'
import { LayoutDashboard, Loader2, Palette, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'
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
type AuthFormValues = { name: string; email: string; password: string }

function getErrorMessage(error: unknown) {
  if (!error) return 'Something went wrong. Please try again.'
  if (typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message
    if (typeof message === 'string' && message.length > 0) return message
  }
  return 'Something went wrong. Please try again.'
}

const FEATURES = [
  {
    icon: <PlusCircle size={16} />,
    text: 'Build surveys with 3 question types',
  },
  {
    icon: <Palette size={16} />,
    text: 'Brand every survey with your identity',
  },
  {
    icon: <LayoutDashboard size={16} />,
    text: 'Read responses in one clean dashboard',
  },
]

export function AuthForm({ mode }: { mode: AuthMode }) {
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)
  const isSignup = mode === 'signup'

  const form = useForm({
    defaultValues: { name: '', email: '', password: '' } satisfies AuthFormValues,
    validators: { onSubmit: isSignup ? signupSchema : loginSchema },
    onSubmit: async ({ value }) => {
      setFormError(null)
      try {
        const response = isSignup
          ? await authClient.signUp.email({
              name: value.name,
              email: value.email,
              password: value.password,
            })
          : await authClient.signIn.email({ email: value.email, password: value.password })
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
    <main className="relative min-h-svh overflow-hidden bg-[#fafafa]">
      {/* Background gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#EEEDFE] opacity-60 blur-3xl" />
        <div className="absolute -bottom-20 right-0 h-[400px] w-[400px] rounded-full bg-[#e0f2fe] opacity-40 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-svh max-w-6xl grid-cols-1 items-center gap-12 px-6 py-12 md:grid-cols-2 md:px-10">
        <section className="hidden flex-col gap-8 md:flex">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img className="h-8" src="/logo.png" alt="respondly" />
          </div>
          <div className="space-y-4">
            <h1 className="text-[clamp(32px,4vw,48px)] font-semibold leading-[1.1] tracking-[-0.03em] text-[#0f0e17]">
              Surveys that feel
              <br />
              like <span className="text-[#7F77DD]">yours</span>
            </h1>
            <p className="max-w-sm text-[16px] leading-relaxed text-[#6b6b80]">
              Build branded forms, share a link, and read every response in one focused dashboard.
            </p>
          </div>

          <ul className="space-y-3">
            {FEATURES.map(({ icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#EEEDFE] text-[#7F77DD]">
                  {icon}
                </span>
                <span className="text-[14px] text-[#4b4b60]">{text}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* RIGHT — form card */}
        <div className="w-full">
          {/* Mobile logo */}
          <div className="mb-6 flex items-center gap-2 md:hidden">
            <span className="size-2.5 rounded-full bg-[#7F77DD]" />
            <span className="text-[15px] font-semibold tracking-tight text-[#0f0e17]">
              Respondly
            </span>
          </div>

          <div className="rounded-2xl border border-black/[0.07] bg-white p-8 shadow-[0_8px_40px_rgba(0,0,0,0.06)]">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-[20px] font-semibold tracking-tight text-[#0f0e17]">
                {isSignup ? 'Create your account' : 'Welcome back'}
              </h2>
              <p className="mt-1 text-[14px] text-[#6b6b80]">
                {isSignup
                  ? 'Start with your name, email, and a password.'
                  : 'Use your email and password to continue.'}
              </p>
            </div>

            {/* Google SSO */}
            <button
              type="button"
              onClick={() =>
                authClient.signIn.social({
                  provider: 'google',
                  callbackURL: 'https://respondly.pages.dev/dashboard',
                })
              }
              className="mb-5 flex w-full items-center justify-center gap-2.5 rounded-lg border border-black/10 bg-white px-4 py-2.5 text-[14px] font-medium text-[#0f0e17] transition-colors hover:bg-[#f5f5f5]"
            >
              <img className="h-4" src="/google.svg" alt="google" />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative mb-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-black/[0.07]" />
              <span className="text-[12px] text-[#9898aa]">or</span>
              <div className="h-px flex-1 bg-black/[0.07]" />
            </div>

            {/* Fields */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                void form.handleSubmit()
              }}
              noValidate
            >
              <FieldGroup className="gap-4">
                {isSignup && (
                  <form.Field name="name">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && field.state.meta.errors.length > 0
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel
                            htmlFor={field.name}
                            className="text-[13px] font-medium text-[#0f0e17]"
                          >
                            Name
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            autoComplete="name"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            className="h-10 rounded-lg border-black/[0.1] bg-[#f8f8fb] text-[14px] placeholder:text-[#9898aa] focus:border-[#7F77DD] focus:ring-[#7F77DD]/20"
                          />
                          <FieldError errors={field.state.meta.errors} />
                        </Field>
                      )
                    }}
                  </form.Field>
                )}

                <form.Field name="email">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && field.state.meta.errors.length > 0
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="text-[13px] font-medium text-[#0f0e17]"
                        >
                          Email
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="email"
                          autoComplete="email"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          className="h-10 rounded-lg border-black/[0.1] bg-[#f8f8fb] text-[14px] placeholder:text-[#9898aa] focus:border-[#7F77DD] focus:ring-[#7F77DD]/20"
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
                        <FieldLabel
                          htmlFor={field.name}
                          className="text-[13px] font-medium text-[#0f0e17]"
                        >
                          Password
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="password"
                          autoComplete={isSignup ? 'new-password' : 'current-password'}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          className="h-10 rounded-lg border-black/[0.1] bg-[#f8f8fb] text-[14px] placeholder:text-[#9898aa] focus:border-[#7F77DD] focus:ring-[#7F77DD]/20"
                        />
                        <FieldError errors={field.state.meta.errors} />
                      </Field>
                    )
                  }}
                </form.Field>

                {formError && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-[13px] text-destructive">
                    {formError}
                  </div>
                )}

                <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
                  {([canSubmit, isSubmitting]) => (
                    <button
                      type="submit"
                      disabled={!canSubmit || isSubmitting}
                      className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-[#7F77DD] py-2.5 text-[14px] font-medium text-white transition-all hover:bg-[#534AB7] hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                      {isSubmitting ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'}
                    </button>
                  )}
                </form.Subscribe>
              </FieldGroup>
            </form>

            {/* Footer */}
            <p className="mt-5 text-center text-[13px] text-[#9898aa]">
              {isSignup ? 'Already have an account?' : 'New to Respondly?'}{' '}
              <Link
                to={isSignup ? '/auth/login' : '/auth/signup'}
                className="font-medium text-[#7F77DD] hover:text-[#534AB7]"
              >
                {isSignup ? 'Sign in' : 'Create one'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
