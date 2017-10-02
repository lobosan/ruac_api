import mongoose from 'mongoose'

import userSchema from './userSchema'
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
  Users: mongoose.model('Users', userSchema),
  Provincias: mongoose.model('Provincias', provinciaSchema),
  Cantones: mongoose.model('Cantones', cantonSchema)
}

export default models
