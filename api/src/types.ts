import type { AuthType } from './utils/auth'

export type Bindings = {
  survey_builder: D1Database
  BUCKET: R2Bucket
  BETTER_AUTH_SECRET: string
  BETTER_AUTH_URL: string
}

export type Variables = {
  user: AuthType['user']
  session: AuthType['session']
}
