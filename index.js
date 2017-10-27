import express from 'express'
import { createServer } from 'http'
import { json } from 'body-parser'
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express'
import { makeExecutableSchema } from 'graphql-tools'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'

import './dotenv'
import models from './models'
import typeDefs from './schema'
import resolvers from './resolvers'
import { refreshTokens } from './auth'

const PORT = 3000
const SECRET = process.env.SECRET
const SECRET_2 = process.env.SECRET_2
const EMAIL_SECRET = process.env.EMAIL_SECRET

const app = express()
app.use(cors({ origin: 'http://ruac2.culturaypatrimonio.gob.ec', credentials: true }))
app.use(cookieParser())

const addUser = async (req, res, next) => {
  const token = req.headers['x-token']
  if (!token) {
    return next()
  }

  const cookieToken = req.cookies.token
  if (!cookieToken || token !== cookieToken) {
    return next()
  }

  try {
    const { user } = jwt.verify(token, SECRET)
    req.user = user
  } catch (error) {
    const refreshToken = req.headers['x-refresh-token']

    if (!refreshToken) {
      return next()
    }

    const cookieRefreshToken = req.cookies['refresh-token']
    if (!cookieRefreshToken || refreshToken !== cookieRefreshToken) {
      return next()
    }

    const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET_2)
    if (newTokens.token && newTokens.refreshToken) {
      res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token')
      res.set('x-token', newTokens.token)
      res.set('x-refresh-token', newTokens.refreshToken)
      res.cookie('token', newTokens.token, { maxAge: 60 * 60 * 24 * 7, httpOnly: true })
      res.cookie('refresh-token', newTokens.refreshToken, { maxAge: 60 * 60 * 24 * 7, httpOnly: true })
    }
    req.user = newTokens.user
  }
  return next()
}

app.use(addUser)

app.get('/confirmacion/:token', async (req, res) => {
  let verificado = false
  try {
    const { user: { _id } } = await jwt.verify(req.params.token, EMAIL_SECRET)
    await models.Usuarios.findOneAndUpdate({ _id }, { $set: { emailConfirmed: true } })
    verificado = true
  } catch (error) {
    console.log('Error al verificar email', error)
    verificado = false
  }
  res.redirect(`http://ruac2.culturaypatrimonio.gob.ec/inicio-sesion?verificado=${verificado}`)
})

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}))

app.use('/graphql', json(), graphqlExpress((req, res) => ({
  schema: makeExecutableSchema({ typeDefs, resolvers }),
  context: { models, SECRET, SECRET_2, EMAIL_SECRET, user: req.user, res }
})))

const server = createServer(app)

server.listen(PORT, () => {
  console.log(`GraphQL server listening on http://localhost:${PORT}/graphiql`)
})
