const Fotografia = require("../models/fotografia.model")

const fotografiaPost = async (req, res) => {
    const { img_url,
        fecha_creacion,
        fotografo_uid,
        metadatos_imgs_uid,
        album_uid } = req.body

    try {

        const nuevaFotografia = await Fotografia.create({
            img_url,
            fecha_creacion,
            fotografo_uid,
            metadatos_imgs_uid,
            album_uid
        })

        console.log('se creo una nueva fotografia con exito')

        res.json({
            nuevaFotografia
        })

    } catch (error) {
        console.log(error)
        res.json({
            mensaje: 'error al crear una fotografia'
        })
    }
}
const fotografiaGet = async (req, res) => {
    try {
        const todosLasFotografias = await Fotografia.findAll()
        res.json(todosLasFotografias)
    } catch (error) {
        console.log(error)
        res.status(404).json({ mensaje: 'error al obtener todas las fotografias' })
    }
}
const fotografiaGetId = async (req, res) => {
    const { uid } = req.params
    try {
        const unaFoto = await Fotografia.findByPk(uid)
        if (unaFoto) {
            return res.json(unaFoto)
        } else {
            return res.status(404).json({ mensaje: 'no se encontro la fotografia' })
        }

    } catch (error) {
        console.log(error)
        res.status(404).json({ mensaje: 'error al buscar una fotografia' })
    }
}
const fotografiaPut = async (req, res) => { }
const fotografiaDelete = async (req, res) => { }

module.exports = {
    fotografiaPost,
    fotografiaGet,
    fotografiaDelete,
    fotografiaGetId,
    fotografiaPut
}