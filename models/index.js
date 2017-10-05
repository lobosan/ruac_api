import mongoose from 'mongoose'

import usuarioSchema from './usuarioSchema'
import paisSchema from './paisSchema'
import provinciaSchema from './provinciaSchema'
import cantonSchema from './cantonSchema'

mongoose.Promise = global.Promise

mongoose.connect(process.env.MONGO_URI, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true
}).then(response => {
  console.log('Connected to MongoLab instance')
}).catch(error => {
  console.log('Error: Not able to connect to MongoLab', error)
})

const models = {
  Usuarios: mongoose.model('Usuarios', usuarioSchema),
  Paises: mongoose.model('Paises', paisSchema),
  Provincias: mongoose.model('Provincias', provinciaSchema),
  Cantones: mongoose.model('Cantones', cantonSchema)
}

export default models
