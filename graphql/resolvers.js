const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const hbs = require('nodemailer-express-handlebars')

const dinardap = require('../lib/dinardap')
const { trySignIn } = require('../lib/auth')
const { requiresAuth } = require('../lib/permissions')
const { verifyTransporter, options, transporter } = require('../email')

module.exports = {
  Query: {
    loggedInUser: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      if (user) {
        const loggedInUser = await models.Usuarios.findOne({ _id: user._id })
        return loggedInUser
      }
      return null
    }),
    logout: (parent, args, { res }) => {
      res.cookie('token', '')
      res.cookie('refresh-token', '')
      return true
    },
    allUsers: async (parent, args, { models }) => {
      return models.Usuarios.find()
    },
    dinardap: async (parent, { cedula }) => {
      return dinardap(cedula)
    },
    paises: async (parent, args, { models }) => {
      return models.Paises.find()
    },
    dpa: async (parent, args, { models }) => {
      return models.Dpas.find()
    }
  },
  Mutation: {
    signUp: async (parent, { signUp }, { models, EMAIL_SECRET }) => {
      try {
        await verifyTransporter()
        const { contrasena, email } = signUp
        const hashedPassword = await bcrypt.hash(contrasena, 12)
        const { _id } = await new models.Usuarios({ ...signUp, contrasena: hashedPassword }).save()
        const emailToken = await jwt.sign({ _id }, EMAIL_SECRET, { expiresIn: '1d' })
        transporter.use('compile', hbs(options))
        await transporter.sendMail({
          to: email,
          subject: 'Confirmar Email',
          template: 'welcome',
          attachments: [{ path: 'email/ruac.png', cid: 'ruac-logo@culturaypatrimonio.gob.ec' }],
          context: { url: `http://172.17.6.74:3000/confirmacion/${emailToken}` }
        })
        return true
      } catch (error) {
        if (error.message.includes('cedula_1 dup key')) {
          throw new Error('La cédula ingresada ya está registrada. Por favor verifique sus datos.')
        } else if (error.message.includes('email_1 dup key')) {
          throw new Error('El email ingresado ya está registrado. Por favor verifique sus datos.')
        } else if (error.message.includes('Invalid login: 535 5.7.8')) {
          throw new Error('Lo sentimos, hubo un error de acceso a nuestro servidor de correo. Por favor inténtelo más tarde.')
        } else {
          throw new Error(error.message)
        }
      }
    },
    signIn: async (parent, { signIn }, { models, SECRET, SECRET_2, res }) => {
      const { token, refreshToken } = await trySignIn(signIn, models, SECRET, SECRET_2)
      res.cookie('token', token, { maxAge: 1 * 60 * 60 * 1000, httpOnly: true })
      res.cookie('refresh-token', refreshToken, { maxAge: 1 * 60 * 60 * 1000, httpOnly: true })
      return { token, refreshToken }
    },
    changePasswordRequest: async (parent, { changePasswordRequest }, { models, EMAIL_SECRET }) => {
      try {
        await verifyTransporter()
        const user = await models.Usuarios.findOne(changePasswordRequest)
        if (!user) throw new Error('Lo sentimos, la información ingresada no corresponde a ningún usuario registrado. Por favor verifique sus datos.')
        const { _id, cambiarContrasena } = user
        if (cambiarContrasena) throw new Error('Lo sentimos, ya existe una solicitud en proceso. Por favor revise su cuenta de correo electrónico o contáctenos.')
        await models.Usuarios.findOneAndUpdate({ _id }, { $set: { cambiarContrasena: true } })
        const emailToken = await jwt.sign({ _id }, EMAIL_SECRET, { expiresIn: '1d' })
        transporter.use('compile', hbs(options))
        const { email } = changePasswordRequest
        await transporter.sendMail({
          to: email,
          subject: 'Solicitud de Cambio de Contraseña',
          template: 'changePasswordRequest',
          attachments: [{ path: 'email/ruac.png', cid: 'ruac-logo@culturaypatrimonio.gob.ec' }],
          context: { url: `http://172.17.6.74:3000/cambiar-contrasena/${emailToken}` }
        })
        return true
      } catch (error) {
        if (error.message.includes('Invalid login: 535 5.7.8')) {
          throw new Error('Lo sentimos, hubo un error de acceso a nuestro servidor de correo. Por favor inténtelo más tarde.')
        } else {
          throw new Error(error.message)
        }
      }
    },
    updatePassword: async (parent, { updatePassword }, { models, EMAIL_SECRET }) => {
      try {
        const { token, contrasena } = updatePassword
        const { _id } = await jwt.verify(token, EMAIL_SECRET)
        const hashedPassword = await bcrypt.hash(contrasena, 12)
        await models.Usuarios.findOneAndUpdate({ _id }, {
          $set: { cambiarContrasena: false, contrasena: hashedPassword }
        })
        return true
      } catch (error) {
        if (error.message.includes('invalid signature')) {
          throw new Error('Lo sentimos, los datos de usuario son incorrectos.')
        } else {
          throw new Error(error.message)
        }
      }
    },
    updateProfile: requiresAuth.createResolver(async (parent, { updateProfile }, { models }) => {
      try {
        const { cedula } = updateProfile
        await models.Usuarios.findOneAndUpdate({ cedula }, { $set: { ...updateProfile } })
        return true
      } catch (error) {
        if (error.message.includes('email_1 dup key')) {
          throw new Error('El email ingresado ya está registrado. Por favor verifique sus datos.')
        } else {
          console.log(error)
          throw new Error('Lo sentimos, hubo un error al actualizar su perfil. Por favor inténtelo más tarde.')
        }
      }
    })
  }
}
