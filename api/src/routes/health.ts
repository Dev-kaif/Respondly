import { Hono } from 'hono'
import { createDb } from '../db'
import { user } from '../db/auth-schema'
import type { Bindings, Variables } from '../types'

const router = new Hono<{ Bindings: Bindings; Variables: Variables }>()

router.get('/health', async (c) => {
  const db = createDb(c.env)

  const result = await db.select().from(user)

  return c.json({
    result,
    success: true,
    status: 'ok',
  })
})

export default router
