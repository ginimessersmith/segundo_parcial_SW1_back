const { Router } = require('express')
const { invitado_fotografiaPost, invitado_fotografiaGetId, invitado_fotografiaGet } = require('../controllers/invitado_fotografia.controller')
const { validarJWT } = require('../middlewaares/validarJWT.middleware')
const { validarCampos } = require('../middlewaares/validarCampos.middlewares')


const router= Router()

router.post('/',[validarJWT,validarCampos],invitado_fotografiaPost)

router.get('/',[validarJWT,validarCampos],invitado_fotografiaGet)

router.get('/:uid',[validarJWT,validarCampos],invitado_fotografiaGetId)

module.exports=router
