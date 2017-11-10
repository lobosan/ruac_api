const mongoose = require('mongoose')

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

module.exports = paisSchema
