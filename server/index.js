const Koa = require('koa')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')

const mongoose=require('mongoose')
const bodyParser =require('koa-bodyparser')
//koa-redis should be combined  with koa-generic-session
const session =require('koa-generic-session')
const Redis =require('koa-redis')
const json =require('koa-json') 
const cors = require('koa2-cors')
const serverInfo=require('./serverInfo.js')
const passport=require('./passport/Local')
const geo=require('./router/geo.js')
const user=require('./router/user.js')
const jas=require('./router/jas.js')
const goods=require('./router/goods.js')
const shop=require('./router/shop.js')
const list=require('./router/list.js')

const app = new Koa()

app.use(cors({
            credentials: true, 
            origin: 'http://127.0.0.1:3000'
        }))
app.proxy = true
app.keys = ['ancient','keys']
app.use(session({  key: 'ancient', store: new Redis(), prefix:'ancient-name:'}))
app.use(bodyParser({
  extendTypes:['json','form','text']
}))

app.use(json())


let DB_URL=serverInfo.mongodb
mongoose.connect(DB_URL,{
  useNewUrlParser:true
})
app.use(passport.initialize())
app.use(passport.session())


// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(app.env === 'production')

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)
  
  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }
	app.use(geo.routes()).use(geo.allowedMethods())
	app.use(user.routes()).use(user.allowedMethods())
	app.use(jas.routes()).use(jas.allowedMethods())
	app.use(goods.routes()).use(goods.allowedMethods())
	app.use(shop.routes()).use(shop.allowedMethods())
	app.use(list.routes()).use(list.allowedMethods())

  app.use(ctx => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
