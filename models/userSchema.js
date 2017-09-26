import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema({
  cedula: {
    type: String,
    index: true,
    unique: true,
    required: true,
    minlength: 10,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    maxlength: 100,
    trim: true
  },
  contrasena: {
    type: String,
    required: true,
    minlength: 9
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
  tercerNivel: {
    type: String,
    required: false
  },
  cuartoNivel: {
    type: String,
    required: false
  },
  estadoAfiliado: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: 'artista'
  },
  confirmed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

export default userSchema
