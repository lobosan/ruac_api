import mongoose from 'mongoose'

import postSchema from './postSchema'
import userSchema from './userSchema'

mongoose.Promise = global.Promise

mongoose.connect(process.env.MONGO_URI, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true
}).then(response => {
  if (response) console.log('Connected to MongoLab instance')
}).catch(error => {
  if (error) console.log('Error: Not able to connect to MongoLab')
})

const models = {
  Post: mongoose.model('Post', postSchema),
  User: mongoose.model('User', userSchema)
}

export default models
