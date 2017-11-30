const { createServer } = require('http')
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const { Engine } = require('apollo-engine')
const { graphiqlExpress, graphqlExpress } = require('apollo-server-express')

const models = require('./models')
const schema = require('./graphql/schema')
const { refreshTokens } = require('./lib/auth')
const {
  PORT,
  ENGINE_API_KEY,
  CLIENT_ORIGIN,
  PUBLIC_URL,
  GRAPHQL_ENDPOINT,
  GRAPHIQL_ENDPOINT,
  SECRET,
  SECRET_2,
  EMAIL_SECRET
} = require('./config')

function setupEngine (app) {
  const engine = new Engine({
    engineConfig: {
      apiKey: ENGINE_API_KEY,
      logging: {
        level: process.env.NODE_ENV === 'production' ? 'WARN' : 'INFO'
      }
    },
    graphqlPort: PORT,
    endpoint: GRAPHQL_ENDPOINT,
    dumpTraffic: true
  })
  engine.start()
  app.use(engine.expressMiddleware())
}

function setupCors (app) {
  app.use(cors({
    origin: CLIENT_ORIGIN,
    credentials: true
  }))
}

function setupParsers (app) {
  app.use(cookieParser())
  app.use(bodyParser.json())
}

function setupSession (app) {
  const addUser = async (req, res, next) => {
    const token = req.headers['x-token']
    if (!token) return next()
    const cookieToken = req.cookies.token
    if (!cookieToken || token !== cookieToken) return next()
    try {
      const { user } = await jwt.verify(token, SECRET)
      req.user = user
    } catch (error) {
      // if token is expired then refresh tokens
      const refreshToken = req.headers['x-refresh-token']
      if (!refreshToken) return next()
      const cookieRefreshToken = req.cookies['refresh-token']
      if (!cookieRefreshToken || refreshToken !== cookieRefreshToken) return next()
      const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET_2)
      if (newTokens.token && newTokens.refreshToken) {
        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token')
        res.set('x-token', newTokens.token)
        res.set('x-refresh-token', newTokens.refreshToken)
        res.cookie('token', newTokens.token, { maxAge: 1 * 60 * 60 * 1000, httpOnly: true })
        res.cookie('refresh-token', newTokens.refreshToken, { maxAge: 1 * 60 * 60 * 1000, httpOnly: true })
      }
      req.user = newTokens.user
    }
    return next()
  }
  app.use(addUser)
}

function setupCompression (app) {
  app.use(compression({ threshold: 0 }))
}

function setupRoutes (app) {
  app.get('/confirmacion/:token', async (req, res) => {
    let verificado = false
    try {
      const { _id } = await jwt.verify(req.params.token, EMAIL_SECRET)
      await models.Usuarios.findOneAndUpdate({ _id }, { $set: { emailConfirmed: true } })
      verificado = true
    } catch (error) {
      console.log('Error al verificar email', error)
      verificado = false
    }
    res.redirect(`${CLIENT_ORIGIN}/inicio-sesion?verificado=${verificado}`)
  })

  app.get('/cambiar-contrasena/:token', async (req, res) => {
    const url = `${CLIENT_ORIGIN}/cambiar-contrasena`
    try {
      let token = null
      await jwt.verify(req.params.token, EMAIL_SECRET)
      token = req.params.token
      res.redirect(`${url}?token=${token}`)
    } catch (error) {
      console.log('Error al verificar token de cambio de contraseña', error)
      res.redirect(url)
    }
  })
}

function setupGraphQL (app) {
  app.use(GRAPHQL_ENDPOINT, graphqlExpress((req, res) => ({
    schema,
    context: {
      models,
      SECRET,
      SECRET_2,
      EMAIL_SECRET,
      user: req.user,
      res
    },
    tracing: true,
    cacheControl: true,
    debug: true
  })))

  app.use(GRAPHIQL_ENDPOINT, graphiqlExpress({
    endpointURL: GRAPHQL_ENDPOINT
  }))
}

function main () {
  const app = express()
  setupEngine(app) // Engine proxy goes first
  setupCors(app)
  setupParsers(app)
  setupSession(app)
  setupCompression(app)
  setupRoutes(app)
  setupGraphQL(app)

  const server = createServer(app)

  server.listen(PORT, () => {
    console.log(`GraphQL API Server listening on ${PUBLIC_URL}${GRAPHIQL_ENDPOINT}`)
  })
}

main()
