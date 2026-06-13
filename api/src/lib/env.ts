import type { Bindings } from '../types'

export const getEnv = (env: Bindings) => ({
  db: env.survey_builder,
  bucket: env.BUCKET,
  betterAuthSecret: env.BETTER_AUTH_SECRET,
  betterAuthUrl: env.BETTER_AUTH_URL,
  frontendUrl: env.FRONTEND_URL,
})

export type Env = ReturnType<typeof getEnv>
