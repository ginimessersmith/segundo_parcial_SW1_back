
const Album = require("../models/album.model")

const albumPost = async (req, res) => {

    const { nombre_album,
        descripcion,
        evento_uid,
        fotografo_uid,
        disponibilidad

    } = req.body
    try {

        const nuevoAlbum = await Album.create({
            nombre_album,
            descripcion,
            evento_uid,
            fotografo_uid,


        })

        console.log('se creo un nuevo album con exito')
        res.json({
            nuevoAlbum
        })
    } catch (error) {

        console.log(error)

        res.json({
            mensaje: 'hubo un error al crear un album'
        })
    }
}
const albumGetPorFotografo = async (req, res) => {
    const { fotografo_uid } = req.params

    try {
        const listaAlbunes = await Album.findAll({
            where: {
                fotografo_uid: fotografo_uid,
                disponibilidad: true
            }
        })

        if (listaAlbunes.length == 0) {
            return res.status(404).json({ mensaje: 'usted no tiene un album' })
        }

        res.status(200).json({ listaAlbunes })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: 'no se encontro ningun album'
        })
    }
}
const albumGetPorEvento = async (req, res) => {
    const { evento_uid } = req.params

    try {
        const listaAlbunes = await Album.findAll({
            where: {
                evento_uid: evento_uid,
                disponibilidad: true
            }
        })

        if (listaAlbunes.length == 0) {
            return res.status(404).json({ mensaje: 'este evento no tiene un album' })
        }
        res.status(200).json({ listaAlbunes })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: 'no se encontro ningun album'
        })
    }
}
const albumGet = async (req,res) => {
    try {
        const todosLosAlbunes = await Album.findAll()
        res.json(todosLosAlbunes)
    } catch (error) {
        console.log(error)
        res.status(404).json({ mensaje: 'error al obtener todos los albunes' })
    }
}

const albumGetId = async (req, res) => {
    const { uid } = req.params

    try {
        const unAlbun = await Album.findOne({
            where: {
                uid: uid
            }
        })

        if (!unAlbun) {
            return res.status(404).json({ mensaje: 'no existe este album' })
        }
        res.status(200).json({ unAlbun })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: 'no se encontro ningun album'
        })
    }
}
const albumPut = async (req, res) => { }
const albumDelete = async (req, res) => { }

module.exports = {
    albumPost,
    albumGetPorFotografo,
    albumGetPorEvento,
    albumDelete,
    albumGetId,
    albumPut,
    albumGet
}