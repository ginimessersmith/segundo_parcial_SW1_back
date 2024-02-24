const Evento = require("../models/evento.model")

const eventoPost = async (req, res) => {
    const { nombre_evento,
        descripcion,
        fecha,
        hora,
        lugar,
        ubicacion,
        organizador_uid
    } = req.body

    try {
        const nuevoEvento = await Evento.create({
            nombre_evento,
            descripcion,
            fecha,
            hora,
            lugar,
            ubicacion,
            organizador_uid
        })

        console.log('sea creado un evento correctamente')

        res.json({
            nuevoEvento
        })

    } catch (error) {

        console.log(error)

        res.json({
            mensaje: 'erro al crear un evento'
        })

    }
}
const eventoGet = async (req, res) => {
   
        try {
            const todosLosEventos = await Evento.findAll({where: {esta_activo:true }})
            res.json(todosLosEventos)
        } catch (error) {
            console.log(error)
            res.status(404).json({ mensaje: 'error al obtener todos los eventos' })
        }
    
 }
const eventoGetId = async (req, res) => {
    const { uid } = req.params
    try {
        const unEvento = await Evento.findByPk(uid)
        if (unEvento) {
            return res.json(unEvento)
        } else {
            return res.status(404).json({mensaje:'no se encontro el evento'})
        }

    } catch (error) {
        console.log(error)
        res.status(404).json({ mensaje: 'Error al buscar un evento' })
    }
}
const eventoPut = async (req, res) => { }
const eventoDelete = async (req, res) => { }

module.exports = {
    eventoPost,
    eventoGet,
    eventoDelete,
    eventoGetId,
    eventoPut
}