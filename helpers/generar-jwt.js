const jwt = require('jsonwebtoken')

const generarJWT = (uuid = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uuid }
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, { expiresIn: '24h' },
         (err,token) => {
            if(err){
                console.log('erro al generar el token: ',err)
                reject('no se pudo generar el token')
            }else{
                resolve(token)
            }
        })
    })
}

module.exports = { generarJWT }