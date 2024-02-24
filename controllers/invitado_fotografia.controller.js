const Invitado_fotografia = require("../models/invitado_fotografias.model")

const invitado_fotografiaPost = async (req, res) => {
    const { visible, invitado_uid, fotografia_uid } = req.body
    try {

        const nuevoinvitado_fotografia = await Invitado_fotografia.create({
            visible,
            invitado_uid,
            fotografia_uid
        })

        console.log('se creo un nuevo invitado_fotografia con exito')
        res.json({
            nuevoinvitado_fotografia
        })
    } catch (error) {

        console.log(error)

        res.json({
            mensaje: 'hubo un error al crear un invitado_fotografia'
        })
    }
}
const invitado_fotografiaGet = async (req, res) => { 
    try {
        const todosInvitado_fotografia = await Invitado_fotografia.findAll()
        res.json(todosInvitado_fotografia)
    } catch (error) {
        console.log(error)
        res.status(404).json({ mensaje: 'error al obtener las fotos Invitado_fotografia' })
    }
}
const invitado_fotografiaGetId = async (req, res) => {
    const { uid } = req.params

    try {

        const unInvitadoFotoI = await Invitado_fotografia.findOne({where:{invitado_uid:uid}})
        const unInvitadoFotoF = await Invitado_fotografia.findOne({where:{fotografia_uid:uid}})
        if (unInvitadoFotoI) {
            return res.json(unInvitadoFotoI)
         } else { 

            if(unInvitadoFotoF){
                return res.json(unInvitadoFotoF)
            }else{
                res.status(404).json({ mensaje: 'no existe el invitado_fotografia' })
            }

        }


    } catch (error) {
        console.log(error)
        res.status(404).json({ mensaje: 'error al buscar invitado_fotografia' })
    }
}
const invitado_fotografiaPut = async (req, res) => { }
const invitado_fotografiaDelete = async (req, res) => { }

module.exports = {
    invitado_fotografiaPost,
    invitado_fotografiaGet,
    invitado_fotografiaDelete,
    invitado_fotografiaGetId,
    invitado_fotografiaPut
}