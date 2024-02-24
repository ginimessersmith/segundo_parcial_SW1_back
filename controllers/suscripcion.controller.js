
const Suscripcion = require("../models/suscripcion.model")

const suscripcionPost = async (req, res) => {
    const {estado,
        fecha_inicio,
        fecha_fin,
        fotografo_uid,
        plan_suscripcion_uid,
        invitado_uid,
        organizador_uid
    } = req.body
    try {

        const nuevaSuscripcion = await Suscripcion.create({
            estado,
            fecha_inicio,
            fecha_fin,
            fotografo_uid,
            plan_suscripcion_uid,
            invitado_uid,
            organizador_uid
        })

        console.log('se creo una nueva suscripcion con exito')
        res.json({
            nuevaSuscripcion
        })
    } catch (error) {

        console.log(error)

        res.json({
            mensaje: 'hubo un error al crear una suscripcion'
        })
    }
}
const suscripcionGet = async (req, res) => { 
    try {
        const todosLasSuscripcion = await Suscripcion.findAll()
        res.json(todosLasSuscripcion)
    } catch (error) {
        console.log(error)
        res.status(404).json({ mensaje: 'error al obtener todos las suscripciones' })
    }
}
const suscripcionGetId = async (req, res) => {
    const{uid}=req.params

    try {

        const unaSuscripcion = await Suscripcion.findByPk(uid)

        if(unaSuscripcion){
            return res.json(unaSuscripcion)
        }else{
            return res.status(404).json({mensaje:'no se encontro la suscripcion'})
        }
        
    } catch (error) {
        console.log(error)
        res.status(404).json({
            mensaje:'error al buscar una suscripcion'
        })
    }
 }
const suscripcionPut = async (req, res) => { }
const suscripcionDelete = async (req, res) => { }

module.exports = {
    suscripcionPost,
    suscripcionGet,
    suscripcionDelete,
    suscripcionGetId,
    suscripcionPut
}