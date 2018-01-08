const restler = require('restler')
const { get } = require('lodash')

const interoperador = async (paquete, cedula) => {
  return new Promise((resolve, reject) => {
    const request = restler.post('https://interoperabilidad.dinardap.gob.ec/interoperador?wsdl', {
      username: process.env.DINARDAP_USER,
      password: process.env.DINARDAP_PASS,
      parser: restler.parsers.xml,
      xml2js: { explicitArray: false, trim: true },
      rejectUnauthorized: false,
      timeout: 9000,
      data: `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
          xmlns:ser="http://servicio.interoperadorws.interoperacion.dinardap.gob.ec/">
          <soapenv:Header/>
          <soapenv:Body>
              <ser:getFichaGeneral>
                <codigoPaquete>${paquete}</codigoPaquete>
                <numeroIdentificacion>${cedula}</numeroIdentificacion>
              </ser:getFichaGeneral>
          </soapenv:Body>
        </soapenv:Envelope>`
    })
    request.on('error', error => {
      console.log('Error al conectarse con la DINARDAP', error)
      reject(new Error('Error al conectarse con la DINARDAP. Por favor inténtelo más tarde.'))
    })
    request.on('timeout', () => {
      reject(new Error('La DINARDAP está tardando en verificar sus datos. Por favor inténtelo más tarde.'))
    })
    request.on('complete', result => {
      if (result instanceof Error) {
        console.log('Error al consultar datos con la DINARDAP', result.message)
        reject(new Error('Error al verificar sus datos con la DINARDAP. Por favor inténtelo nuevamente.'))
      } else if (result['soap:Envelope']['soap:Body']['soap:Fault']) {
        if (paquete === 619) {
          reject(new Error('La cédula ingresada no consta en el Registro Civil. Por favor verifique sus datos.'))
        } else if (paquete === 620) {
          if (result['soap:Envelope']['soap:Body']['soap:Fault']['faultstring'] === '02:TIEMPO DE ESPERA EXCEDIDO EN LA FUENTE') {
            reject(new Error('La SENESCYT está tardando en verificar sus datos. Por favor inténtelo nuevamente.'))
          } else {
            resolve({ titulosSenescyt: [] })
          }
        } else if (paquete === 621) {
          resolve({ estadoAfiliado: '' })
        }
      } else {
        const rootPath = `['soap:Envelope']['soap:Body']['ns2:getFichaGeneralResponse']['return']['instituciones']`
        let data = get(result, rootPath)
        let institucion = {}
        if (data.nombre === 'SENESCYT') {
          data = get(result, `${rootPath}['detalle']['items']`)
          let titulosSenescyt = []
          if (Array.isArray(data)) {
            data.forEach(obj => titulosSenescyt.push(obj.registros.valor))
            institucion['titulosSenescyt'] = titulosSenescyt
          } else if (typeof data === 'object') {
            titulosSenescyt.push(data.registros.valor)
            institucion['titulosSenescyt'] = titulosSenescyt
          }
        } else {
          data = get(result, `${rootPath}['datosPrincipales']['registros']`)
          if (Array.isArray(data)) {
            data.forEach(obj => {
              if (obj.campo === 'fechaNacimiento') {
                const fecha = obj.valor.split('/')
                institucion['fechaNacimiento'] = `${fecha[2]}-${fecha[1]}-${fecha[0]}`
              } else {
                institucion[obj.campo] = obj.valor
              }
            })
          } else if (typeof data === 'object') {
            institucion[data.campo] = data.valor
          }
        }
        resolve(institucion)
      }
    })
  })
}

const dinardap = async cedula => {
  try {
    const registroCivil = await interoperador(619, cedula)
    let data = await Promise.all([
      interoperador(620, cedula),
      interoperador(621, cedula)
    ])
    return Object.assign(...[registroCivil, ...data])
  } catch (error) {
    return error
  }
}

module.exports = dinardap
