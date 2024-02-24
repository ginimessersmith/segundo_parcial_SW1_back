
const Plan_suscripcion = require("../models/plan_suscripcion.model")

const plan_suscripcionPost = async (req, res) => {
    const { nombre_plan,
        precio,
        periodicidad,
        descripcion,

    } = req.body
    try {

        const nuevoPlan_suscripcon = await Plan_suscripcion.create({
            nombre_plan,
            precio,
            periodicidad,
            descripcion,

        })

        console.log('se creo un nuevo plan de suscripcion con exito')
        res.json({
            nuevoPlan_suscripcon
        })
    } catch (error) {

        console.log(error)

        res.json({
            mensaje: 'hubo un error al crear un plan de suscripcion'
        })
    }
}
const plan_suscripcionGet = async (req, res) => { 
    try {
        const todosLosPlan_suscripcion = await Plan_suscripcion.findAll()
        res.json(todosLosPlan_suscripcion)
    } catch (error) {
        console.log(error)
        res.status(404).json({ mensaje: 'error al obtener todos los planes de suscripcion' })
    }
}
const plan_suscripcionGetId = async (req, res) => { 
    const {uid} = req.params
    try {
        const unPlan = await Plan_suscripcion.findByPk(uid)

        if(unPlan){
            return res.json(unPlan)
        }else{
            return res.status(404).json({mensaje:'no se encontro el plan de suscripcion'})
        }
    } catch (error) {
        console.log(error)
        res.status(404).json({mensaje:'error al buscar un plan de suscripcion'})
    }
}
const plan_suscripcionPut = async (req, res) => { }
const plan_suscripcionDelete = async (req, res) => { }

module.exports = {
    plan_suscripcionPost,
    plan_suscripcionGet,
    plan_suscripcionDelete,
    plan_suscripcionGetId,
    plan_suscripcionPut
}