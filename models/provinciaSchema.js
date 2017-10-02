import mongoose from 'mongoose'

const Schema = mongoose.Schema

const provinciaSchema = new Schema({
  codigoProvincia: {
    type: String,
    index: true,
    unique: true,
    required: true,
    trim: true
  },
  provincia: {
    type: String,
    unique: true,
    required: true,
    trim: true
  }
})

export default provinciaSchema
