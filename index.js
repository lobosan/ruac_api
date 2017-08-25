import express from 'express'
import bodyParser from 'body-parser'
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express'
import { makeExecutableSchema } from 'graphql-tools'
import jwt from 'jsonwebtoken'

import './dotenv'
import models from './models'
import typeDefs from './schema'
import resolvers from './resolvers'

const SECRET = process.env.SECRET
const PORT = 3000
const app = express()

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

const addUser = async (req, res, next) => {
  const token = req.headers.authorization
  if (token) {
    try {
      const { user } = await jwt.verify(token, SECRET)
      req.user = user
    } catch (error) {
      console.log('JWT verification token error:', error)
    }
  }
  next()
}

app.use(addUser)

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
      user: req.user
    }
  }))
)

app.listen(PORT, () => {
  console.log(`GraphQL server listening on http://localhost:${PORT}/graphiql`)
})
