module.exports = `

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
  titulosSenescyt: [String]
  estadoAfiliado: String
  tipoAfiliado: String
  email: String!
  telefonoFijo: String
  telefonoCelular: String
  paisDomicilio: String
  provinciaDomicilio: String
  codigoProvinciaDomicilio: String
  cantonDomicilio: String
  codigoCantonDomicilio: String
  nombreArtistico: String
  tipoActorCultural: String
  actividadPrincipal: String
  actividadSecundaria: String
  postulacionesFinanciamiento: [String]
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

type Dinardap {
  nombre: String!
  fechaNacimiento: String!
  lugarNacimiento: String!
  nacionalidad: String!
  sexo: String!
  titulosSenescyt: [String]!
  estadoAfiliado: String
}

type AuthPayload {
  token: String!
  refreshToken: String!
}

type Pais {
  codigoPais: String!
  pais: String!
}

type Dpa {
  codigoProvincia: String!
  provincia: String!
  codigoCanton: String!
  canton: String!
}

input SignUp {
  cedula: String!,
  contrasena: String!,
  nombre: String!,
  fechaNacimiento: String!,
  lugarNacimiento: String!,
  nacionalidad: String!,
  sexo: String!,
  estadoAfiliado: String,
  titulosSenescyt: [String]!,
  email: String!
}

type Query {
  loggedInUser: Usuario!
  logout: Boolean!
  allUsers: [Usuario!]!
  dinardap(cedula: String!): Dinardap!
  paises: [Pais!]!
  dpa: [Dpa!]!
}

type Mutation {
  signUp (signUp: SignUp!): Boolean!

  signIn (
    cedula: String!,
    contrasena: String!
  ): AuthPayload!

  requestPasswordChange (
    cedula: String!,
    email: String!
  ): Boolean!

  updatePassword (
    token: String!,
    contrasena: String!
  ): Boolean!

  updateProfile (
    cedula: String!,
    tipoAfiliado: String!,
    email: String!,
    telefonoFijo: String,
    telefonoCelular: String,
    paisDomicilio: String!,
    provinciaDomicilio: String,
    codigoProvinciaDomicilio: String,
    cantonDomicilio: String,
    codigoCantonDomicilio: String,
    nombreArtistico: String,
    tipoActorCultural: String!,
    actividadPrincipal: String!,
    actividadSecundaria: String,
    postulacionesFinanciamiento: [String],
    otrasEntidadesApoyo: String,
    obrasRegistradasIEPI: String!,
    perteneceOrgCultural: String!,
    logrosAlcanzados: String,
    proyectosCulturales: String,
    formacionCapacitacion: String,
    webBlog: String,
    youtube: String,
    facebook: String,
    twitter: String
  ): Usuario!

}

schema {
  query: Query
  mutation: Mutation
}
`
