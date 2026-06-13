import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import * as authSchema from '../db/auth-schema'
import { createDb } from '../db/index'
import type { Bindings } from '../types'

export const createAuth = (env: Bindings) => {
  return betterAuth({
    database: drizzleAdapter(createDb(env), {
      provider: 'sqlite',
      schema: authSchema,
    }),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    emailAndPassword: { enabled: true },
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID as string,
        clientSecret: env.GOOGLE_CLIENT_SECRET as string,
      },
    },
    trustedOrigins: ['http://localhost:5173', env.FRONTEND_URL],
    advanced: {
      cookies: {
        session_token: {
          attributes: {
            sameSite: 'none',
            secure: true,
          },
        },
      },
    },
  })
}

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null
  session: typeof auth.$Infer.Session.session | null
}

// need a temporary instance just for type inference
const auth = createAuth({} as Bindings)
