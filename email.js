import nodemailer from 'nodemailer'

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

export default transporter
