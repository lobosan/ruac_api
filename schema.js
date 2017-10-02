export default `

type User {
  _id: ID!
  cedula: String!
  email: String!
  contrasena: String!
  nombre: String!
  fechaNacimiento: String!
  lugarNacimiento: String!
  nacionalidad: String!
  sexo: String!
  tercerNivel: String
  cuartoNivel: String
  estadoAfiliado: String
}

type Dinardap {
  nombre: String!
  fechaNacimiento: String!
  lugarNacimiento: String!
  nacionalidad: String!
  sexo: String!
  tercerNivel: String
  cuartoNivel: String
  estadoAfiliado: String
}

type Provincia {
  codigoProvincia: String!
  provincia: String!
}

type Canton {
  codigoProvincia: String!
  codigoCanton: String!
  canton: String!
}

type Query {
  loggedInUser: User!
  allUsers: [User!]!
  dinardap(cedula: String!): Dinardap!
  provincias: [Provincia!]!
  cantones(codigoProvincia: String!): [Canton!]!
}

type Mutation {
  signUp(cedula: String!, email: String!, contrasena: String!, nombre: String!, fechaNacimiento: String!, lugarNacimiento: String!, nacionalidad: String!, sexo: String!, tercerNivel: String, cuartoNivel: String, estadoAfiliado: String): User!
  signIn(cedula: String!, contrasena: String!): String!
}

`
