import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import bodyParser from 'body-parser'
import cron from 'node-cron'
import { createOrderbookRouter } from '../../api/orderbook'
import { checkAndUpdateAllOrderStatuses } from '../../api/status-order-check'
import { cleanUpClosedOrders } from '../../api/clean-db'
import { startEventListeners } from '../../api/events-listener'

const bootstrapApp = async () => {
  const app = express()
  const isDevMode = process.env.NODE_ENV === 'development'
  app.use(helmet())
  app.enable('trust proxy')
  app.use(compression())
  app.use(express.json())

  // CORS configuration to whitelist a single domain
  app.use(
    cors({
      origin: function (origin, callback) {
        if (isAllowedOrigin(origin)) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      },
    })
  )

  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())

  // Rate Limiter
  // const limiter = rateLimit({
  //   windowMs: 15 * 60 * 1000,
  //   max: 100,
  //   standardHeaders: true,
  //   legacyHeaders: false,
  //   keyGenerator: (req) => {
  //     const forwarded = req.headers['x-forwarded-for']
  //     const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded
  //     return ip || req.socket.remoteAddress || 'default'
  //   },
  // })

  // app.use(limiter)

  // Function to check if the origin is in the whitelist
  function isAllowedOrigin(origin) {
    // if (isDevMode) {
    //   return true // Allow all origins in development mode
    // }
    // const allowedDomains = ['testnet.forlootandglory.io', 'game.forlootandglory.io', 'market.forlootandglory.io']
    // if (!origin) return false
    // const originDomain = new URL(origin).hostname
    // return allowedDomains.includes(originDomain)
    return true
  }

  // Basic Healthchecks
  app.get('/', (_, res) => res.sendStatus(200))
  app.get('/v2', (_, res) => res.sendStatus(200))
  app.get('/healthcheck', (_, res) => res.sendStatus(200))
  app.get('/status', (_, res) => res.sendStatus(200))

  app.use('/orderbook', createOrderbookRouter())

  cron.schedule('0 0 * * *', async () => {
    await checkAndUpdateAllOrderStatuses().then(() => console.log('Daily order status update task executed.'))
    await cleanUpClosedOrders().then(() => console.log('Daily closed order cleanup task executed.'))
  })

  startEventListeners()

  // Error middlewares
  app.use((_req, _res, next) => {
    const err = new Error('Not Found') as any
    err.status = 404
    next(err)
  })

  app.use((error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(error.status || 403).json({ error: 'Access Forbidden' })
  })

  return app
}

export { bootstrapApp }
