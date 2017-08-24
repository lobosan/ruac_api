import mongoose from 'mongoose'

const Schema = mongoose.Schema

const postSchema = new Schema({
  name: String
})

export default postSchema
