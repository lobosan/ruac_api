export default `
type Post {
  _id: ID!
  name: String!
}

type User {
  _id: ID!
  cedula: String!
  apellidosNombres: String!
  email: String!
  fechaNacimiento: String!
}

type Dinardap {
  nombre: String!
  fechaNacimiento: String!
  provincia: String!
  canton: String!
  parroquia: String!
  nacionalidad: String!
  sexo: String!
  tercerNivel: String
  cuartoNivel: String
  estadoAfiliado: String
}

type Query {
  post(_id: ID!): Post
  allPosts: [Post]
  loggedInUser: User
  allUsers: [User!]!
  dinardap(cedula: String!): Dinardap!
}

type Mutation {
  createPost(name: String!): Post!
  signUp(cedula: String!, apellidosNombres: String!, email: String!, fechaNacimiento: String!, contrasena: String!): User!
  signIn(cedula: String!, contrasena: String!): String!
}
`
