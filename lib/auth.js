const jwt = require('jsonwebtoken')
const { pick } = require('lodash')
const bcrypt = require('bcrypt')

const createTokens = async (user, SECRET, SECRET_2) => {
  const createToken = jwt.sign(
    { user: pick(user, ['_id', 'cedula', 'role']) },
    SECRET,
    { expiresIn: '1h' }
  )
  const createRefreshToken = jwt.sign(
    { user: pick(user, '_id') },
    SECRET_2,
    { expiresIn: '7d' }
  )
  return Promise.all([createToken, createRefreshToken])
}

const refreshTokens = async (token, refreshToken, models, SECRET, SECRET_2) => {
  let userId = 0
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

const trySignIn = async ({ cedula, contrasena }, models, SECRET, SECRET_2) => {
  const user = await models.Usuarios.findOne({ cedula })
  if (!user) {
    throw new Error('La cédula ingresada no está registrada. Por favor verifique sus datos.')
  }
  if (!user.emailConfirmed) {
    throw new Error('Por favor confirme su email mediante el correo enviado al momento de su registro. En caso de no haberlo recibido contáctenos.')
  }
  const valid = await bcrypt.compare(contrasena, user.contrasena)
  if (!valid) {
    throw new Error('La contraseña ingresada es incorrecta. Por favor verifique sus datos.')
  }
  const refreshSecret = SECRET_2 + user.contrasena // if password changes the token expires
  const [token, refreshToken] = await createTokens(user, SECRET, refreshSecret)
  return { token, refreshToken }
}

module.exports = {
  createTokens,
  refreshTokens,
  trySignIn
}
