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

const SECRET = process.env.SECRET
const PORT = 3000

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

const addUser = (req, res, next) => {
  const token = req.headers['token']
  if (token) {
    try {
      const { user } = jwt.verify(token, SECRET)
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
