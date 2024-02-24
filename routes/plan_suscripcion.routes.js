const {Router}=require('express')
const { plan_suscripcionPost, plan_suscripcionGetId, plan_suscripcionGet } = require('../controllers/plan_suscripcion')
const { validarCampos } = require('../middlewaares/validarCampos.middlewares')
const { validarJWT } = require('../middlewaares/validarJWT.middleware')
const { esOrganizadorRole } = require('../middlewaares/esOrganizadorRole.middleware')
const router = Router()

router.post('/',[validarJWT,esOrganizadorRole,validarCampos],plan_suscripcionPost)
router.get('/:uid',[
    validarJWT,
    validarCampos],plan_suscripcionGetId)

    router.get('/',[
        validarJWT,
        validarCampos],plan_suscripcionGet)

module.exports=router