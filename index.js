import express from 'express'
import bodyParser from 'body-parser'
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express'
import { makeExecutableSchema } from 'graphql-tools'
import cors from 'cors'
import jwt from 'jsonwebtoken'

import './dotenv'
import models from './models'
import typeDefs from './schema'
import resolvers from './resolvers'

const PORT = 3000
const SECRET = process.env.SECRET
const EMAIL_SECRET = process.env.EMAIL_SECRET

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

const addUser = async (req, res, next) => {
  const token = req.headers['token']
  if (token) {
    try {
      const { user } = await jwt.verify(token, SECRET)
      req.user = user
    } catch (error) {
      console.log('JWT verification token error')
    }
  }
  next()
}

const app = express()

app.use(cors('*'))
app.use(addUser)

app.get('/confirmacion/:token', async (req, res) => {
  let verificado = false
  try {
    const { user: { _id } } = await jwt.verify(req.params.token, EMAIL_SECRET)
    await models.Users.findOneAndUpdate({ _id }, { $set: { confirmed: true } })
    verificado = true
  } catch (error) {
    console.log('Error al verificar email', error)
    verificado = false
  }
  res.redirect(`http://172.17.6.74:8080/inicio-sesion?verificado=${verificado}`)
})

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql'
  })
)

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(req => ({
    schema,
    context: {
      models,
      SECRET,
      EMAIL_SECRET,
      user: req.user
    }
  }))
)

app.listen(PORT, () => {
  console.log(`GraphQL server listening on http://localhost:${PORT}/graphiql`)
})
