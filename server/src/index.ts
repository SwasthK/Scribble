import { Hono } from 'hono'
import api from './Routes/routes'
import { cors } from 'hono/cors'
import { connectPrismaClient } from 'Client/prismaClient'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string,
    CORS_ORIGIN: string,
  }
}>().basePath('/api/v1');

app.use('*', connectPrismaClient)

app.use('*', async (c, next) => {
  const corsMiddlewareHandler = cors({
    origin: c.env.CORS_ORIGIN,
  })
  return corsMiddlewareHandler(c, next)
})

app.route('/', api)

app.notFound((c) => {
  return c.text('404 Not Found')
})

app.onError((err, c) => {
  console.error(`${err}`)
  return c.text('An Unexpected Error Occurred', 500)
})

export default app;