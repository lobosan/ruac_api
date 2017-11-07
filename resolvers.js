import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import hbs from 'nodemailer-express-handlebars'

import dinardap from './dinardap'
import { verifyTransporter, options, transporter } from './email'
import { requiresAuth } from './permissions'
import { trySignIn } from './auth'

export default {
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
    signUp: async (parent, args, { models, EMAIL_SECRET }) => {
      try {
        await verifyTransporter()
        const hashedPassword = await bcrypt.hash(args.contrasena, 12)
        const { _id } = await new models.Usuarios({ ...args, contrasena: hashedPassword }).save()
        const emailToken = await jwt.sign({ _id }, EMAIL_SECRET, { expiresIn: '1d' })
        transporter.use('compile', hbs(options))
        await transporter.sendMail({
          to: args.email,
          subject: 'Confirmar Email',
          template: 'welcome',
          attachments: [{ path: 'email/ruac.png', cid: 'ruac-logo@culturaypatrimonio.gob.ec' }],
          context: { url: `http://172.17.6.74:3000/confirmacion/${emailToken}` }
        })
        return true
      } catch (error) {
        if (error.message.includes('cedula_1 dup key')) {
          throw new Error('La cédula ingresada ya está registrada')
        } else if (error.message.includes('email_1 dup key')) {
          throw new Error('El email ingresado ya está registrado')
        } else if (error.message.includes('Invalid login: 535 5.7.8')) {
          throw new Error('Lo sentimos, hubo un error de acceso a nuestro servidor de correo. Por favor inténtelo más tarde.')
        } else {
          throw new Error(error.message)
        }
      }
    },
    signIn: async (parent, { cedula, contrasena }, { models, SECRET, SECRET_2, res }) => {
      const { token, refreshToken } = await trySignIn(cedula, contrasena, models, SECRET, SECRET_2)
      res.cookie('token', token, { maxAge: 60 * 60 * 24 * 7, httpOnly: true })
      res.cookie('refresh-token', refreshToken, { maxAge: 60 * 60 * 24 * 7, httpOnly: true })
      return { token, refreshToken }
    },
    requestPasswordChange: async (parent, { cedula, email }, { models, EMAIL_SECRET }) => {
      try {
        await verifyTransporter()
        const user = await models.Usuarios.findOne({ cedula, email })
        if (!user) throw new Error('Lo sentimos, no encontramos ningún usuario con estos datos. Por favor revíselos.')
        if (user._id.cambiarContrasena) throw new Error('Lo sentimos, ya existe una solicitud. Por favor revise su cuenta de correo electrónico o contáctenos.')
        await models.Usuarios.findOneAndUpdate({ _id: user._id }, { $set: { cambiarContrasena: true } })
        const emailToken = await jwt.sign({ _id: user._id }, EMAIL_SECRET, { expiresIn: '1d' })
        transporter.use('compile', hbs(options))
        await transporter.sendMail({
          to: email,
          subject: 'Solicitud de Cambio de Contraseña',
          template: 'requestPasswordChange',
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
    updatePassword: async (parent, { token, contrasena }, { models, EMAIL_SECRET }) => {
      try {
        const { _id } = jwt.verify(token, EMAIL_SECRET)
        const hashedPassword = await bcrypt.hash(contrasena, 12)
        await models.Usuarios.findOneAndUpdate({ _id }, {
          $set: { cambiarContrasena: false, contrasena: hashedPassword }
        })
        return true
      } catch (error) {
        if (error.message.includes('invalid token')) {
          throw new Error('Los datos de usuario son incorrectos.')
        } else {
          throw new Error(error.message)
        }
      }
    },
    updateProfile: async (parent, {
      cedula,
      tipoAfiliado,
      email,
      telefonoFijo,
      telefonoCelular,
      paisDomicilio,
      provinciaDomicilio,
      codigoProvinciaDomicilio,
      cantonDomicilio,
      codigoCantonDomicilio,
      nombreArtistico,
      tipoActorCultural,
      actividadPrincipal,
      actividadSecundaria,
      postulacionesFinanciamiento,
      otrasEntidadesApoyo,
      obrasRegistradasIEPI,
      perteneceOrgCultural,
      logrosAlcanzados,
      proyectosCulturales,
      formacionCapacitacion,
      webBlog,
      youtube,
      facebook,
      twitter
    }, { models }) => {
      try {
        return models.Usuarios.findOneAndUpdate({ cedula }, {
          $set: {
            tipoAfiliado,
            email,
            telefonoFijo,
            telefonoCelular,
            paisDomicilio,
            provinciaDomicilio,
            codigoProvinciaDomicilio,
            cantonDomicilio,
            codigoCantonDomicilio,
            nombreArtistico,
            tipoActorCultural,
            actividadPrincipal,
            actividadSecundaria,
            postulacionesFinanciamiento,
            otrasEntidadesApoyo,
            obrasRegistradasIEPI,
            perteneceOrgCultural,
            logrosAlcanzados,
            proyectosCulturales,
            formacionCapacitacion,
            webBlog,
            youtube,
            facebook,
            twitter
          }
        })
      } catch (error) {
        if (error.message.includes('users.$cedula_1 dup key')) {
          throw new Error('La cédula ingresada ya está registrada')
        } else if (error.message.includes('users.$email_1 dup key')) {
          throw new Error('El email ingresado ya está registrado')
        } else if (error.message.includes('Invalid login: 535 5.7.8')) {
          throw new Error('Lo sentimos, hubo un error de acceso a nuestro servidor de correo. Por favor inténtelo más tarde.')
        } else {
          throw new Error(error.message)
        }
      }
    }
  }
}
