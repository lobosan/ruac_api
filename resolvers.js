import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import _ from 'lodash'

import { requiresAuth } from './permissions'

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
    createPost: requiresAuth.createResolver(async (parent, args, { models }) => {
      const post = await new models.Post(args).save()
      return post
    }),
    signUp: async (parent, args, { models }) => {
      const user = args
      user.contrasena = await bcrypt.hash(user.contrasena, 12)
      try {
        const newUser = await new models.User(user).save()
        return newUser
      } catch (error) {
        if (error.message.includes('users.$cedula_1 dup key')) {
          throw new Error('La cédula ingresada ya está registrada')
        } else if (error.message.includes('users.$email_1 dup key')) {
          throw new Error('El email ingresado ya está registrado')
        } else {
          throw new Error(error.message)
        }
      }
    },
    signIn: async (parent, { cedula, contrasena }, { models, SECRET }) => {
      const user = await models.User.findOne({ cedula })
      if (!user) {
        throw new Error('La cédula ingresada no está registrada')
      }

      const valid = await bcrypt.compare(contrasena, user.contrasena)
      if (!valid) {
        throw new Error('Contraseña incorrecta')
      }

      const token = jwt.sign(
        { user: _.pick(user, ['_id', 'cedula', 'role']) },
        SECRET,
        { expiresIn: '7d' }
      )

      return token
    }
  }
}
