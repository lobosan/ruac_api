import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import _ from 'lodash'

import { requiresAuth, requiresAdmin } from './permissions'

export default {
  Query: {
    post: async (parent, { _id }, { models }) => {
      const post = await models.Post.findOne({ _id })
      return post
    },
    allPosts: async (parent, args, { models }) => {
      const posts = await models.Post.find()
      return posts
    },
    loggedInUser: (parent, args, { models, user }) => {
      if (user) {
        return models.User.findOne({ _id: user._id })
      }
      return null
    },
    allUsers: (parent, args, { models }) => models.User.find()
  },
  Mutation: {
    createPost: requiresAdmin.createResolver(async (parent, args, { models }) => {
      const post = await new models.Post(args).save()
      return post
    }),
    signup: async (parent, args, { models }) => {
      const user = args
      user.password = await bcrypt.hash(user.password, 12)
      try {
        const newUser = await new models.User(user).save()
        return newUser
      } catch (error) {
        if (error.message.includes('username')) {
          throw new Error('Username in use')
        }
        if (error.message.includes('email')) {
          throw new Error('Email in use')
        }
      }
    },
    login: async (parent, { email, password }, { models, SECRET }) => {
      const user = await models.User.findOne({ email })
      if (!user) {
        throw new Error('Not user with that email')
      }

      const valid = await bcrypt.compare(password, user.password)
      if (!valid) {
        throw new Error('Incorrect password')
      }

      const token = jwt.sign(
        { user: _.pick(user, ['_id', 'username', 'role']) },
        SECRET,
        { expiresIn: '1y' }
      )

      return token
    }
  }
}
