
const Qr = require("../models/qr.model")

const qrPost = async (req, res) => {
    const { habilitado,
        tipo,
        url_code,
        invitado_uid,
        fotografo_uid,
    } = req.body
    try {
        if(invitado_uid){
            const nuevoqr = await Qr.create({
                habilitado,
                tipo,
                url_code,
                invitado_uid,
                
            })
    
            console.log('se creo un nuevo qr con exito')
            return res.json({
                nuevoqr
            })

        }else{
            const nuevoqr = await Qr.create({
                habilitado,
                tipo,
                url_code,
                fotografo_uid
                
            })
    
            console.log('se creo un nuevo qr con exito')
            return res.json({
                nuevoqr
            })
        }
        
    } catch (error) {

        console.log(error)

        res.json({
            mensaje: 'hubo un error al crear un qr'
        })
    }
}
const qrGet = async (req, res) => { 
    try {
        const todosLosQr = await Qr.findAll()
        res.json(todosLosQr)
    } catch (error) {
        console.log(error)
        res.status(404).json({ mensaje: 'error al obtener todos los Qr' })
    }
}
const qrGetId = async (req, res) => { 
    const {uid}=req.params

    try {

        const unQr = await Qr.findByPk(uid)
        
        if(unQr){
            return res.json(unQr)
        }else{
            return res.status(404).json({mensaje:'no existe el qr'})
        }
        
    } catch (error) {
        console.log(error)
        res.status(404).json({mensaje:'error al buscar un qr'})
    }
}
const qrPut = async (req, res) => { }
const qrDelete = async (req, res) => { }

module.exports = {
    qrPost,
    qrGet,
    qrDelete,
    qrGetId,
    qrPut
}