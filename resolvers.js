import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import _ from 'lodash'

import dinardap from './dinardap'
import transporter from './email'
import { requiresAuth } from './permissions'

export default {
  Query: {
    loggedInUser: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      const loggedInUser = await models.User.findOne({ _id: user._id })
      return loggedInUser
    }),
    allUsers: async (parent, args, { models }) => {
      const users = await models.User.find()
      return users
    },
    dinardap: async (parent, { cedula }) => {
      const data = await dinardap(cedula)
      return data
    }
  },
  Mutation: {
    signUp: async (parent, args, { models, EMAIL_SECRET }) => {
      const hashedPassword = await bcrypt.hash(args.contrasena, 12)
      try {
        const user = await new models.User({ ...args, contrasena: hashedPassword }).save()
        const emailToken = await jwt.sign(
          { user: _.pick(user, '_id') },
          EMAIL_SECRET,
          { expiresIn: '1d' }
        )
        transporter.sendMail({
          to: args.email,
          subject: 'Confirmar email',
          template: 'welcome',
          attachments: [{
            path: 'emails/ruac.jpg',
            cid: 'ruac-logo@culturaypatrimonio.gob.ec'
          }],
          context: { url: `http://localhost:3000/confirmacion/${emailToken}` }
        }, (error) => {
          if (error) throw new Error(error)
        })
        return user
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
      if (!user.confirmed) {
        throw new Error('Su email no ha sido confirmado. Por favor revise su bandeja de entrada o regístrese nuevamente')
      }
      const valid = await bcrypt.compare(contrasena, user.contrasena)
      if (!valid) {
        throw new Error('Contraseña incorrecta')
      }
      const token = await jwt.sign(
        { user: _.pick(user, ['_id', 'cedula', 'role']) },
        SECRET,
        { expiresIn: '7d' }
      )
      return token
    }
  }
}
