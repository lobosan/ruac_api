import restler from 'restler'
import _ from 'lodash'

const interoperador = (paquete, cedula) => {
  return new Promise((resolve, reject) => {
    const request = restler.post('https://interoperabilidad.dinardap.gob.ec/interoperador?wsdl', {
      username: process.env.DINARDAP_USER,
      password: process.env.DINARDAP_PASS,
      parser: restler.parsers.xml,
      xml2js: { explicitArray: false, trim: true },
      timeout: 3000,
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
    request.on('error', _ => {
      reject(new Error('Error al conectarse con la DINARDAP. Por favor inténtelo más tarde'))
    })
    request.on('timeout', ms => {
      reject(new Error('La DINARDAP está tardando en verificar sus datos. Por favor inténtelo más tarde'))
    })
    request.on('complete', result => {
      if (result instanceof Error) {
        reject(new Error('Error al verificar sus datos con la DINARDAP. Por favor inténtelo más tarde'))
      } else if (result['soap:Envelope']['soap:Body']['soap:Fault']) {
        reject(new Error('Cédula no válida'))
      } else {
        const rootPath = `['soap:Envelope']['soap:Body']['ns2:getFichaGeneralResponse']['return']['instituciones']`
        let data = _.get(result, rootPath)
        let institucion = {}
        if (data.nombre !== 'SENESCYT') {
          data = _.get(result, `${rootPath}['datosPrincipales']['registros']`)
          if (Array.isArray(data)) {
            data.forEach(obj => { institucion[obj.campo] = obj.valor })
          }
          if (typeof data === 'object') {
            institucion[data.campo] = data.valor
          }
        } else {
          data = _.get(result, `${rootPath}['detalle']['items']`)
          data.forEach(obj => { institucion[obj.nombre] = obj.registros.valor })
        }
        resolve(institucion)
      }
    })
  })
}

const dinardap = (cedula) => {
  return Promise.all([
    interoperador(619, cedula),
    interoperador(620, cedula),
    interoperador(621, cedula),
    interoperador(622, cedula)
  ])
}

export default dinardap
