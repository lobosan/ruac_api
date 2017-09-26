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

type Query {
  loggedInUser: User!
  allUsers: [User!]!
  dinardap(cedula: String!): Dinardap!
}

type Mutation {
  signUp(cedula: String!, email: String!, contrasena: String!, nombre: String!, fechaNacimiento: String!, lugarNacimiento: String!, nacionalidad: String!, sexo: String!, tercerNivel: String, cuartoNivel: String, estadoAfiliado: String): User!
  signIn(cedula: String!, contrasena: String!): String!
}

`
