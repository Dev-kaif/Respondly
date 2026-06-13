import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { createDb } from '../db'
import { user } from '../db/auth-schema'
import type { Bindings, Variables } from '../types'
import { apiError } from '../utils/validators'

const router = new Hono<{
  Bindings: Bindings
  Variables: Variables
}>()

router.delete('/user/delete', async (c) => {
  const currentUser = c.get('user')

  if (!currentUser) return apiError(c, 401, 'Unauthorized')

  const db = createDb(c.env)

  await db.delete(user).where(eq(user.id, currentUser.id))

  return c.json({
    success: true,
  })
})

export default router
