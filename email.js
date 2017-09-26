import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'

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
  viewPath: 'emails',
  extName: '.hbs'
}

transporter.use('compile', hbs(options))

export default transporter
