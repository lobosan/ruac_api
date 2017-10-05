import mongoose from 'mongoose'

const Schema = mongoose.Schema

const paisSchema = new Schema({
  codigoPais: {
    type: String,
    index: true,
    unique: true,
    required: true,
    trim: true
  },
  pais: {
    type: String,
    unique: true,
    required: true,
    trim: true
  }
})

export default paisSchema
