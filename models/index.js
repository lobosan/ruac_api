import mongoose from 'mongoose'

import usuarioSchema from './usuarioSchema'
import paisSchema from './paisSchema'
import dpaSchema from './dpaSchema'

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
  Dpas: mongoose.model('Dpas', dpaSchema)
}

export default models
