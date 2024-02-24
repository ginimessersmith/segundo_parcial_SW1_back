const { Router } = require('express')
const { suscripcionPost, suscripcionGetId, suscripcionGet } = require('../controllers/suscripcion.controller')
const { validarJWT } = require('../middlewaares/validarJWT.middleware')
const { esOrganizadorRole } = require('../middlewaares/esOrganizadorRole.middleware')
const { validarCampos } = require('../middlewaares/validarCampos.middlewares')


const router= Router()

router.post('/',[validarJWT,esOrganizadorRole,validarCampos],suscripcionPost)
router.get('/',[validarJWT,validarCampos],suscripcionGet)

router.get('/:uid',[validarJWT,validarCampos],suscripcionGetId)

module.exports=router
