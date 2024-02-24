const jwt = require('jsonwebtoken')
const Organizador = require('../models/organizador.model')
const Invitado = require('../models/invitado.model')
const Fotografo = require('../models/fotografo.model')

const validarJWT = async (req, res, next) => {
    const token = req.header('x-token')

    if (!token) {
        return res.status(401).json({
            mensaje: 'Usuario no autorizado, no hay token en la peticion'
        })
    }

    try {
        const { uuid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        const organizadorAutenticado = await Organizador.findOne({ where: { uid: uuid } })        
        const invitadoAutenticado = await Invitado.findOne({ where: { uid: uuid } })
        const fotografoAutenticado = await Fotografo.findOne({ where: { uid: uuid } })

        if (!organizadorAutenticado && !invitadoAutenticado && !fotografoAutenticado) {
            return res.status(401).json({
                mensaje: 'El usuario no existe en la base de datos'
            })
        }

        if (organizadorAutenticado) {
            if (organizadorAutenticado.estado_suscripcion == false) {
                return res.status(401).json({
                    mensaje: 'El organizador no tiene una suscripcion valida'
                })
            }
            req.usuarioAutenticado = organizadorAutenticado

        }

        if (invitadoAutenticado) {
            if (invitadoAutenticado.estado_suscripcion == false) {
                return res.status(401).json({
                    mensaje: 'El invitado no tiene una suscripcion valida'
                })
            }
            req.usuarioAutenticado = invitadoAutenticado
        }
        if (fotografoAutenticado) {
            if (fotografoAutenticado.estado_suscripcion == false) {
                return res.status(401).json({
                    mensaje: 'El fotografo no tiene una suscripcion valida'
                })
            }
            req.usuarioAutenticado = fotografoAutenticado
        }

        console.log('request: ',req.usuarioAutenticado)
        next()

    } catch (error) {
        console.log(error)
        return res.status(401).json({
            mensaje: 'Usuario no autorizado, token no valido'
        })
    }
}

module.exports = { validarJWT }