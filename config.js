require('dotenv').config()

module.exports = {
  PORT: process.env.PORT,
  ENGINE_API_KEY: process.env.ENGINE_API_KEY,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
  PUBLIC_URL: process.env.PUBLIC_URL,
  GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT,
  GRAPHIQL_ENDPOINT: process.env.GRAPHIQL_ENDPOINT,
  SECRET: process.env.SECRET,
  SECRET_2: process.env.SECRET_2,
  EMAIL_SECRET: process.env.EMAIL_SECRET,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  DINARDAP_USER: process.env.DINARDAP_USER,
  DINARDAP_PASS: process.env.DINARDAP_PASS,
  MONGO_URI: process.env.MONGO_URI
}
