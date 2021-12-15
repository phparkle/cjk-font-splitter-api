import Koa from 'koa'
import Router from 'koa-router'
import koaBody from 'koa-body'

const app = new Koa()
const router = new Router()

router.post('/cjk-font', async (ctx) => {
  console.log(ctx.headers)
  console.log(ctx.request.body)
  console.log(ctx.request.files)
  ctx.body = { your: 'font here' }
})

app.use(koaBody({ multipart: true }))
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000)
