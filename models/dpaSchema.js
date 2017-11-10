const mongoose = require('mongoose')

const Schema = mongoose.Schema

const dpaSchema = new Schema({
  codigoProvincia: {
    type: String,
    index: true,
    required: true
  },
  provincia: {
    type: String,
    required: true
  },
  codigoCanton: {
    type: String,
    index: true,
    required: true
  },
  canton: {
    type: String,
    required: true
  }
})

module.exports = dpaSchema
