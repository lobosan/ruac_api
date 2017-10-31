import jwt from 'jsonwebtoken'
import _ from 'lodash'
import bcrypt from 'bcrypt'

export const createTokens = async (user, secret, secret2) => {
  const createToken = jwt.sign(
    { user: _.pick(user, ['_id', 'cedula', 'role']) },
    secret,
    { expiresIn: '1m' }
  )

  const createRefreshToken = jwt.sign(
    { user: _.pick(user, '_id') },
    secret2,
    { expiresIn: '7d' }
  )

  return Promise.all([createToken, createRefreshToken])
}

export const refreshTokens = async (token, refreshToken, models, SECRET, SECRET_2) => {
  let userId = -1
  try {
    const { user: { _id } } = jwt.decode(refreshToken)
    userId = _id
  } catch (error) {
    return {}
  }

  if (!userId) {
    return {}
  }

  const user = await models.Usuarios.findOne({ _id: userId })

  if (!user) {
    return {}
  }

  const refreshSecret = SECRET_2 + user.contrasena

  try {
    jwt.verify(refreshToken, refreshSecret)
  } catch (error) {
    return {}
  }

  const [newToken, newRefreshToken] = await createTokens(user, SECRET, refreshSecret)

  return { token: newToken, refreshToken: newRefreshToken, user }
}

export const trySignIn = async (cedula, contrasena, models, SECRET, SECRET_2) => {
  const user = await models.Usuarios.findOne({ cedula })
  if (!user) {
    throw new Error('La cédula ingresada no está registrada.')
  }
  if (!user.emailConfirmed) {
    throw new Error('Su email no ha sido confirmado. Por favor revise su bandeja de entrada o regístrese nuevamente.')
  }

  const valid = await bcrypt.compare(contrasena, user.contrasena)
  if (!valid) {
    throw new Error('La contraseña es incorrecta.')
  }

  const [token, refreshToken] = await createTokens(user, SECRET, SECRET_2 + user.contrasena)

  return { token, refreshToken }
}