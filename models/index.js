const mongoose = require('mongoose')

const { MONGO_URI } = require('../config')
const usuarioSchema = require('./usuarioSchema')
const paisSchema = require('./paisSchema')
const dpaSchema = require('./dpaSchema')

mongoose.Promise = global.Promise

mongoose.connect(MONGO_URI, {
  keepAlive: true,
  reconnectTries: 3,
  useMongoClient: true
}).then(response => {
  console.log('Connected to MongoDB instance')
}).catch(error => {
  console.log('Error: Not able to connect to MongoDB', error)
})

const models = {
  Usuarios: mongoose.model('Usuarios', usuarioSchema),
  Paises: mongoose.model('Paises', paisSchema),
  Dpas: mongoose.model('Dpas', dpaSchema)
}

module.exports = models
