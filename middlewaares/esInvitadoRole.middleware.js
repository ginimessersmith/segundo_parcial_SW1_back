const esInvitadoRole = (req, res, next) => {
    if (!req.usuarioAutenticado) {
        return res.status(500).json({
            mensaje: 'esInvitadoRole se esta ejecutando antes del validarJWT'
        })
    }
    
    const { rol_user,fullname,correo_electronico } = req.usuarioAutenticado
    
    if (rol_user != 'invitado') {
        return res.status(401).json({
            mensaje: `el usuario con el nombre: ${fullname} con correo: ${correo_electronico} , no esta autorizado a realizar esta accion`
        })
    }
    next()
}

module.exports={esInvitadoRole}