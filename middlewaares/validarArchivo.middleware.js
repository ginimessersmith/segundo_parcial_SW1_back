const validarArchivo = (req, res, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).json({
            mensaje: 'no hay un archivo que subir'
        })
        return
    }//? en caso de que no venga ningun archivo

    next()
}

module.exports = {
    validarArchivo

}