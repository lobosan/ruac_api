import mongoose from 'mongoose'

const Schema = mongoose.Schema

const usuarioSchema = new Schema({
  cedula: {
    type: String,
    index: true,
    unique: true,
    minlength: 10,
    trim: true,
    required: true
  },
  contrasena: {
    type: String,
    minlength: 9,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  fechaNacimiento: {
    type: String,
    required: true
  },
  lugarNacimiento: {
    type: String,
    required: true
  },
  nacionalidad: {
    type: String,
    required: true
  },
  sexo: {
    type: String,
    required: true
  },
  estadoAfiliado: {
    type: String,
    required: false
  },
  tipoAfiliado: {
    type: String,
    required: false
  },
  titulosSenescyt: {
    type: [String],
    required: false
  },
  email: {
    type: String,
    unique: true,
    maxlength: 100,
    trim: true,
    required: true
  },
  emailConfirmed: {
    type: Boolean,
    default: false
  },
  telefonoFijo: {
    type: String,
    required: false
  },
  telefonoCelular: {
    type: String,
    required: false
  },
  paisDomicilio: {
    type: String,
    required: false
  },
  provinciaDomicilio: {
    type: String,
    required: false
  },
  codigoProvinciaDomicilio: {
    type: String,
    required: false
  },
  cantonDomicilio: {
    type: String,
    required: false
  },
  codigoCantonDomicilio: {
    type: String,
    required: false
  },
  nombreArtistico: {
    type: String,
    required: false
  },
  tipoActorCultural: {
    type: String,
    required: false
  },
  actividadPrincipal: {
    type: String,
    required: false
  },
  actividadSecundaria: {
    type: String,
    required: false
  },
  postulacionesFinanciamiento: {
    type: [String],
    required: false
  },
  otrasEntidadesApoyo: {
    type: String,
    required: false
  },
  obrasRegistradasIEPI: {
    type: String,
    required: false
  },
  perteneceOrgCultural: {
    type: String,
    required: false
  },
  logrosAlcanzados: {
    type: String,
    required: false
  },
  proyectosCulturales: {
    type: String,
    required: false
  },
  formacionCapacitacion: {
    type: String,
    required: false
  },
  webBlog: {
    type: String,
    required: false
  },
  youtube: {
    type: String,
    required: false
  },
  facebook: {
    type: String,
    required: false
  },
  twitter: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: 'artista'
  }
}, {
  timestamps: true
})

export default usuarioSchema
