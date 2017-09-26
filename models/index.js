import mongoose from 'mongoose'

import userSchema from './userSchema'

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
  User: mongoose.model('User', userSchema)
}

export default models
