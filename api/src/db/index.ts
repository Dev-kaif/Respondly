import { drizzle } from 'drizzle-orm/d1'
import type { Bindings } from '../types'
import * as authSchema from './auth-schema'
import * as schema from './schema'

export const createDb = (env: Bindings) => {
  return drizzle(env.survey_builder, { schema: { ...schema, ...authSchema } })
}

export type DB = ReturnType<typeof createDb>
