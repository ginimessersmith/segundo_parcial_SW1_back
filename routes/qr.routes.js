const { Router } = require('express')
const { qrPost, qrGetId, qrGet } = require('../controllers/qr.controller')
const { validarJWT } = require('../middlewaares/validarJWT.middleware')
const { validarCampos } = require('../middlewaares/validarCampos.middlewares')


const router= Router()

router.post('/',[validarJWT,validarCampos],qrPost)
router.get('/',[validarJWT,validarCampos],qrGet)
router.get('/:uid',[validarJWT,validarCampos],qrGetId)

module.exports=router
