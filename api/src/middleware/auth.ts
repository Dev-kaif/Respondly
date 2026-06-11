import { createMiddleware } from 'hono/factory'
import type { Bindings, Variables } from '../types'
import { createAuth } from '../utils/auth'

export const authMiddleware = createMiddleware<{
  Bindings: Bindings
  Variables: Variables
}>(async (c, next) => {
  const publicRoutes = ['/api/auth', '/api/survey']

  if (publicRoutes.some((route) => c.req.path.startsWith(route))) {
    return next()
  }

  const authInstance = createAuth(c.env)

  const session = await authInstance.api.getSession({
    headers: c.req.raw.headers,
  })

  c.set('user', session?.user ?? null)
  c.set('session', session?.session ?? null)

  await next()
})
