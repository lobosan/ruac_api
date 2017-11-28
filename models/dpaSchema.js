const mongoose = require('mongoose')

const Schema = mongoose.Schema

const dpaSchema = new Schema({
  codigo: {
    type: String,
    index: true,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  }
})

module.exports = dpaSchema
