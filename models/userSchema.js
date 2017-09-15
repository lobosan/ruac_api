import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema({
  cedula: {
    type: String,
    index: true,
    unique: true,
    required: [true, 'La cédula es obligatoria'],
    minlength: [10, 'La cédula debe ser de 10 dígitos'],
    trim: true
  },
  apellidosNombres: {
    type: String,
    required: [true, 'Sus apellidos y nombres son obligatorios'],
    maxlength: [250, 'Su nombre tiene demasiados caracteres'],
    uppercase: true,
    trim: true
  },
  email: {
    type: String,
    unique: [true, 'El email ingresado ya está en uso'],
    required: [true, 'El email es obligatorio'],
    maxlength: [100, 'Su email tiene demasiados caracteres'],
    trim: true
  },
  fechaNacimiento: {
    type: String,
    required: [true, 'Su fecha de nacimiento es obligatoria'],
    maxlength: [100, 'Su fecha de na tiene demasiados caracteres'],
    trim: true
  },
  contrasena: {
    type: String,
    required: true,
    minlength: [9, 'La contraseña debe tener al menos 9 caracteres']
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
