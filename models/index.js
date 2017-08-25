import mongoose from 'mongoose'

import postSchema from './postSchema'
import userSchema from './userSchema'

const MONGO_URI = process.env.MONGO_URI

mongoose.Promise = global.Promise

mongoose.connect(MONGO_URI, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true
})

mongoose.connection
  .once('open', () => console.log('Connected to MongoLab instance'))
  .on('error', error => console.log('Error connecting to MongoLab:', error))

const models = {
  Post: mongoose.model('Post', postSchema),
  User: mongoose.model('User', userSchema)
}

export default models
