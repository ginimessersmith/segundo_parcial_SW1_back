const esFotografoRole = (req, res, next) => {
    if (!req.usuarioAutenticado) {
        return res.status(500).json({
            mensaje: 'esFotografoRole se esta ejecutando antes del validarJWT'
        })
    }
    
    const { rol_user,fullname,correo_electronico } = req.usuarioAutenticado
    
    if (rol_user != 'fotografo') {
        return res.status(401).json({
            mensaje: `el usuario con el nombre: ${fullname} con correo: ${correo_electronico} , no esta autorizado a realizar esta accion, no es un fotografo`
        })
    }
    next()
}

module.exports={esFotografoRole}