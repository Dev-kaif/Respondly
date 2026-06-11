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
    trustedOrigins: ['http://localhost:5173'],
  })
}

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null
  session: typeof auth.$Infer.Session.session | null
}

// need a temporary instance just for type inference
const auth = createAuth({} as Bindings)
