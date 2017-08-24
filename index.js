import express from 'express'
import bodyParser from 'body-parser'
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express'
import { makeExecutableSchema } from 'graphql-tools'
import jwt from 'jsonwebtoken'

import './dotenv'
import models from './models'
import typeDefs from './schema'
import resolvers from './resolvers'

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

const SECRET = process.env.SECRET

const app = express()

const addUser = async req => {
  const token = req.headers.authorization
  if (token) {
    try {
      const { user } = await jwt.verify(token, SECRET)
      req.user = user
    } catch (error) {
      console.log('JWT verification token error:', error)
    }
  }
  req.next()
}

app.use(addUser)

// GraphiQL is reachable on http://localhost:3000/graphiql
app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql'
  })
)

// bodyParser is needed for POST requests
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

app.listen(3000)
