const {Router}=require('express')
const { imagenes_entrenamientoPost, imagenes_entrenamientoGetId, imagenes_entrenamientoGet } = require('../controllers/imagenes_entrenamiento.controller')
const { validarJWT } = require('../middlewaares/validarJWT.middleware')
const { esInvitadoRole } = require('../middlewaares/esInvitadoRole.middleware')
const { validarCampos } = require('../middlewaares/validarCampos.middlewares')
const router=Router()

router.post('/',[
    validarJWT,
    esInvitadoRole,
    validarCampos
],imagenes_entrenamientoPost)

router.get('/',[
    validarJWT,
   
    validarCampos
],imagenes_entrenamientoGet)

router.get('/:uid',[
    validarJWT,    
    validarCampos
],imagenes_entrenamientoGetId)

module.exports=router