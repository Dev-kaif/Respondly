import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { authMiddleware } from './middleware/auth'
import auth from './routes/auth'
import forms from './routes/forms'
import questions from './routes/questions'
import responses from './routes/responses'
import type { Bindings, Variables } from './types'

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>({
  strict: false,
})

app.use(
  '*',
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  }),
)

app.use('*', authMiddleware)

const routes = [auth, forms, questions, responses] as const

const api = app.basePath('/api')

routes.forEach((route) => {
  api.route('/', route)
})

export default app
