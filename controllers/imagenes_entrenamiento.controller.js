const Imagenes_entrenamiento = require("../models/imagenes_entrenamiento.model")

const imagenes_entrenamientoPost = async (req, res) => {
    const { img_url,invitado_uid } = req.body

    try {
        
        const nuevaImgEntrenamiento = await Imagenes_entrenamiento.create({
            img_url,
            invitado_uid
        })

        console.log('img creado con exito ')

        res.json({
            nuevaImgEntrenamiento 
        })

    } catch (error) {
        console.log(error)
        res.status(404).json({
            mensaje:'error al crear una img de entrenamiento'
        })
    }

}
const imagenes_entrenamientoGet = async (req, res) => { 
    try {
        const todosImagenes_entrenamiento = await Imagenes_entrenamiento.findAll()
        res.json(todosImagenes_entrenamiento)
    } catch (error) {
        console.log(error)
        res.status(404).json({ mensaje: 'error al obtener las imagenes de entrenamientpo' })
    }
}
const imagenes_entrenamientoGetId = async (req, res) => { 
    const {uid}=req.params
    try {
        const unaImgEntre = await Imagenes_entrenamiento.findByPk(uid)
        if(unaImgEntre){
            return res.json(unaImgEntre)
        }else{
            return res.status(404).json({mensaje:'no se encontro la imagen de entrenamiento'})
        }
    } catch (error) {
        console.log(error)
        res.status(404).json({mensaje:'Error al buscar una imagen de entrenamiento'})
    }
}
const imagenes_entrenamientoPut = async (req, res) => { }
const imagenes_entrenamientoDelete = async (req, res) => { }

module.exports = {
    imagenes_entrenamientoPost,
    imagenes_entrenamientoGet,
    imagenes_entrenamientoDelete,
    imagenes_entrenamientoGetId,
    imagenes_entrenamientoPut
}