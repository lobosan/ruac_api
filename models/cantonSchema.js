import mongoose from 'mongoose'

const Schema = mongoose.Schema

const cantonSchema = new Schema({
  codigoProvincia: {
    type: String,
    index: true,
    required: true,
    trim: true
  },
  codigoCanton: {
    type: String,
    index: true,
    unique: true,
    required: true,
    trim: true
  },
  canton: {
    type: String,
    required: true,
    trim: true
  }
})

export default cantonSchema
