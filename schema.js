export default `

type Usuario {
  _id: ID!
  cedula: String!
  contrasena: String!
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
  cantonDomicilio: String
  nombreArtistico: String
  tipoActividad: String
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
  declaracion: String
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

type Pais {
  codigoPais: String!
  pais: String!
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
  loggedInUser: Usuario!
  allUsers: [Usuario!]!
  dinardap(cedula: String!): Dinardap!
  paises: [Pais!]!
  provincias: [Provincia!]!
  cantones(codigoProvincia: String!): [Canton!]!
}

type Mutation {
  signUp(cedula: String!, contrasena: String!, nombre: String!, fechaNacimiento: String!, lugarNacimiento: String!, nacionalidad: String!, sexo: String!, estadoAfiliado: String, titulosSenescyt: [String], email: String!): Usuario!
  signIn(cedula: String!, contrasena: String!): String!
  updateProfile(cedula: String!, tipoAfiliado: String!, email: String!, telefonoFijo: String, telefonoCelular: String, paisDomicilio: String!, provinciaDomicilio: String, cantonDomicilio: String, nombreArtistico: String, tipoActividad: String!, actividadPrincipal: String!, actividadSecundaria: String, postulacionesFinanciamiento: [String], otrasEntidadesApoyo: String, obrasRegistradasIEPI: String!, perteneceOrgCultural: String!, logrosAlcanzados: String, proyectosCulturales: String, formacionCapacitacion: String, webBlog: String, youtube: String, facebook: String, twitter: String, declaracion: String!): Usuario!
}

`
