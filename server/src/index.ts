import { Hono } from 'hono'
import api from './Routes/routes'

//Import Middleware
// import { logger } from 'hono/logger'
// import { prettyJSON } from 'hono/pretty-json'
import { cors } from 'hono/cors'
import { connectPrismaClient } from 'Client/prismaClient'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>().basePath('/api/v1');

app.use('*', connectPrismaClient)

//Middlewares
app.use('/*', cors(
  // {
  //   origin: '*',
  //   allowHeaders: ['Content-Type', 'Authorization'],
  //   allowMethods: ['POST', 'GET', 'DELETE', 'PUT'],
  //   credentials: true,
  // }
))

// app.use(prettyJSON())
// app.use(logger())

app.route('/', api)

app.notFound((c) => {
  return c.text('404 Not Found')
})

app.onError((err, c) => {
  console.error(`${err}`)
  return c.text('Unexpected Error Occurred', 500)
})

export default app;