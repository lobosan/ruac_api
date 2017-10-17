import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import _ from 'lodash'

import dinardap from './dinardap'
import { transporter, verifyTransporter } from './email'
import { requiresAuth } from './permissions'

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
      return true
    },
    allUsers: async (parent, args, { models }) => {
      const users = await models.Usuarios.find()
      return users
    },
    dinardap: async (parent, { cedula }) => {
      const data = await dinardap(cedula)
      return data
    },
    paises: async (parent, args, { models }) => {
      const paises = await models.Paises.find()
      return paises
    },
    provincias: async (parent, args, { models }) => {
      const provincias = await models.Provincias.find()
      return provincias
    },
    cantones: async (parent, { codigoProvincia }, { models }) => {
      const cantones = await models.Cantones.find({ codigoProvincia })
      return cantones
    }
  },
  Mutation: {
    signUp: async (parent, args, { models, EMAIL_SECRET }) => {
      const hashedPassword = await bcrypt.hash(args.contrasena, 12)
      try {
        await verifyTransporter()
        const user = await new models.Usuarios({ ...args, contrasena: hashedPassword }).save()
        const emailToken = await jwt.sign(
          { user: _.pick(user, '_id') },
          EMAIL_SECRET,
          { expiresIn: '1d' }
        )
        await transporter.sendMail({
          to: args.email,
          subject: 'Confirmar email',
          template: 'welcome',
          attachments: [{
            path: 'emails/ruac.png',
            cid: 'ruac-logo@culturaypatrimonio.gob.ec'
          }],
          context: { url: `http://172.17.6.74:3000/confirmacion/${emailToken}` }
        })
        return user
      } catch (error) {
        if (error.message.includes('usuarios.$cedula_1 dup key')) {
          throw new Error('La cédula ingresada ya está registrada')
        } else if (error.message.includes('usuarios.$email_1 dup key')) {
          throw new Error('El email ingresado ya está registrado')
        } else if (error.message.includes('Invalid login: 535 5.7.8')) {
          throw new Error('Lo sentimos, hubo un error de acceso a nuestro servidor de correo. Por favor inténtelo más tarde.')
        } else {
          throw new Error(error.message)
        }
      }
    },
    signIn: async (parent, { cedula, contrasena }, { models, SECRET, res }) => {
      const user = await models.Usuarios.findOne({ cedula })
      if (!user) {
        throw new Error('La cédula ingresada no está registrada')
      }
      if (!user.emailConfirmed) {
        throw new Error('Su email no ha sido confirmado. Por favor revise su bandeja de entrada o regístrese nuevamente')
      }
      const valid = await bcrypt.compare(contrasena, user.contrasena)
      if (!valid) {
        throw new Error('Contraseña incorrecta')
      }
      const token = await jwt.sign(
        { user: _.pick(user, ['_id', 'cedula', 'role']) },
        SECRET,
        { expiresIn: '1h' }
      )
      res.cookie('token', token, { maxAge: 60 * 60 * 24 * 7, httpOnly: true })
      return true
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
        const user = await models.Usuarios.findOneAndUpdate({ cedula }, {
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
        return user
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
