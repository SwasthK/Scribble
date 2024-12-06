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
app.use('*', cors({
  origin: 'http://localhost:5173',
  allowHeaders: ['Content-Type', 'Authorization', 'accessToken', 'refreshToken'],
  allowMethods: ['POST', 'GET', 'DELETE', 'PUT', 'OPTIONS'],
  credentials: true,
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 86400, 
}))

// app.options('*', (req) => {
//   return new Response(null, {
//     status: 204,
//     headers: {
//       'Access-Control-Allow-Origin': 'http://localhost:5173',
//       'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type, Authorization, accessToken, refreshToken',
//     },
//   });
// });

// app.use(prettyJSON())
// app.use(logger())

app.route('/', api)

app.notFound((c) => {
  return c.text('404 Not Found')
})

app.onError((err, c) => {
  console.error(`${err}`)
  return c.text('An Unexpected Error Occurred', 500)
})

export default app;