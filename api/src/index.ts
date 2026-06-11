import { Hono } from 'hono'
import { authMiddleware } from './middleware/auth'
import auth from './routes/auth'
import forms from './routes/forms'
import questions from './routes/questions'
import responses from './routes/responses'
import type { Bindings, Variables } from './types'

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>({
  strict: false,
})

app.use('*', authMiddleware)

const routes = [auth, forms, questions, responses] as const

const api = app.basePath('/api')

routes.forEach((route) => {
  api.route('/', route)
})

export default app
