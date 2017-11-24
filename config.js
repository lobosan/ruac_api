require('dotenv').config()

const PORT = process.env.PORT
const ENGINE_API_KEY = process.env.ENGINE_API_KEY
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN
const PUBLIC_URL = process.env.PUBLIC_URL
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT
const GRAPHIQL_ENDPOINT = process.env.GRAPHIQL_ENDPOINT
const SECRET = process.env.SECRET
const SECRET_2 = process.env.SECRET_2
const EMAIL_SECRET = process.env.EMAIL_SECRET
const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASS = process.env.EMAIL_PASS
const DINARDAP_USER = process.env.DINARDAP_USER
const DINARDAP_PASS = process.env.DINARDAP_PASS
const MONGO_URI = process.env.MONGO_URI

module.exports = {
  PORT,
  ENGINE_API_KEY,
  CLIENT_ORIGIN,
  PUBLIC_URL,
  GRAPHQL_ENDPOINT,
  GRAPHIQL_ENDPOINT,
  SECRET,
  SECRET_2,
  EMAIL_SECRET,
  EMAIL_USER,
  EMAIL_PASS,
  DINARDAP_USER,
  DINARDAP_PASS,
  MONGO_URI
}
