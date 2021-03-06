const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'mail.culturaypatrimonio.gob.ec',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
}, {
  from: '"RUAC" <ruac-informativo@culturaypatrimonio.gob.ec>'
})

const options = {
  viewEngine: {
    extname: '.hbs'
  },
  viewPath: 'email',
  extName: '.hbs'
}

const verifyTransporter = async () => {
  return Promise.race([
    transporter.verify(),
    new Promise((resolve, reject) => {
      return setTimeout(() => {
        return reject(
          new Error('Lo sentimos en este momento no podemos enviar correos electrónicos. Por favor inténtelo más tarde.')
        )
      }, 5000)
    })
  ])
}

module.exports = {
  transporter,
  options,
  verifyTransporter
}
