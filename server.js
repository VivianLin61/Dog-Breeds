import Koa from 'koa'
import Router from '@koa/router'
import BodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import fetch from 'isomorphic-fetch'
import Logger from 'koa-logger'
import serve from 'koa-static'
import mount from 'koa-mount'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = new Koa()

const static_pages = new Koa()
static_pages.use(serve(__dirname + '/client/build')) //serve the build directory
app.use(mount('/', static_pages))

const PORT = process.env.PORT || 3011

app.use(BodyParser())
app.use(Logger())
app.use(cors({ origin: '*' }))

const router = new Router()
//Request all breeds
router.get('/breeds', async (ctx, next) => {
  let response = await fetch('https://dog.ceo/api/breeds/list/all', {
    method: 'GET',
  })
  if (response.ok) {
    let json = await response.json()
    ctx.status = 200
    ctx.body = json
  } else {
    ctx.status = response.status
  }
  await next()
})
//Request images of breed
router.post('/breed/images', async (ctx, next) => {
  let response = await fetch(
    `https://dog.ceo/api/breed/${ctx.request.body.breed}/images`,
    {
      method: 'GET',
    }
  )
  if (response.ok) {
    let json = await response.json()
    ctx.status = 200
    ctx.body = json
  } else {
    ctx.status = response.status
  }
  await next()
})

app.use(async (ctx, next) => {
  await next()
  const rt = ctx.response.get('X-Response-Time')
  console.log(`${ctx.method} ${ctx.url} - ${rt}`)
})

app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(PORT, function () {
  console.log(
    '==> 🌎  Listening on port %s. Visit http://localhost:%s/',
    PORT,
    PORT
  )
})
