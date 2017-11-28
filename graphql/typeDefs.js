module.exports = `

type Dpa {
  codigo: String
  descripcion: String
}

type Usuario {
  _id: ID!
  cedula: String!
  contrasena: String!
  cambiarContrasena: Boolean
  nombre: String!
  fechaNacimiento: String!
  lugarNacimiento: String!
  nacionalidad: String!
  sexo: String!
  titulosSenescyt: [String]!
  estadoAfiliado: String
  tipoAfiliado: String
  email: String!
  telefonoFijo: String
  telefonoCelular: String
  paisDomicilio: String
  provinciaDomicilio: Dpa
  cantonDomicilio: Dpa
  nombreArtistico: String
  tipoActorCultural: String
  actividadPrincipal: String
  actividadSecundaria: String
  fondosConcursables: String
  auspicios: String
  cncine: String
  foncultura: String
  otrasEntidadesApoyo: String
  obrasRegistradasIEPI: String
  perteneceOrgCultural: String
  logrosAlcanzados: String
  proyectosCulturales: String
  formacionCapacitacion: String
  webBlog: String
  youtube: String
  facebook: String
  twitter: String
}

type AuthPayload {
  token: String!
  refreshToken: String!
}

type Pais {
  codigoPais: String!
  pais: String!
}

input SignUp {
  cedula: String!
  contrasena: String!
  nombre: String!
  fechaNacimiento: String!
  lugarNacimiento: String!
  nacionalidad: String!
  sexo: String!
  estadoAfiliado: String
  titulosSenescyt: [String]!
  email: String!
}

input SignIn {
  cedula: String!
  contrasena: String!
}

input ChangePasswordRequest {
  cedula: String!
  email: String!
}

input UpdatePassword {
  token: String!
  contrasena: String!
}

input DpaInput {
  codigo: String
  descripcion: String
}

input UpdateProfile {
  cedula: String!
  tipoAfiliado: String!
  email: String!
  telefonoFijo: String
  telefonoCelular: String
  paisDomicilio: String!
  provinciaDomicilio: DpaInput
  cantonDomicilio: DpaInput
  nombreArtistico: String
  tipoActorCultural: String!
  actividadPrincipal: String!
  actividadSecundaria: String
  fondosConcursables: String
  auspicios: String
  cncine: String
  foncultura: String
  otrasEntidadesApoyo: String
  obrasRegistradasIEPI: String!
  perteneceOrgCultural: String!
  logrosAlcanzados: String
  proyectosCulturales: String
  formacionCapacitacion: String
  webBlog: String
  youtube: String
  facebook: String
  twitter: String
}

type Query {
  loggedInUser: Usuario!
  logout: Boolean!
  allUsers: [Usuario!]!
  dinardap(cedula: String!): Usuario!
  paises: [Pais!]!
  dpa: [Dpa!]!
}

type Mutation {
  signUp (signUp: SignUp!): Boolean!
  signIn (signIn: SignIn!): AuthPayload!
  changePasswordRequest (changePasswordRequest: ChangePasswordRequest!): Boolean!
  updatePassword (updatePassword: UpdatePassword!): Boolean!
  updateProfile (updateProfile: UpdateProfile!): Boolean!
}

schema {
  query: Query
  mutation: Mutation
}
`
