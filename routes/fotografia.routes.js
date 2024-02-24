const { Router } = require('express')
const { fotografiaPost, fotografiaGetId, fotografiaGet } = require('../controllers/fotografia.controller')
const { validarJWT } = require('../middlewaares/validarJWT.middleware')
const { esFotografoRole } = require('../middlewaares/esFotografoRole')
const { validarCampos } = require('../middlewaares/validarCampos.middlewares')
const router = Router()

router.post('/', [validarJWT,
    esFotografoRole,
    validarCampos], fotografiaPost)

router.get('/:uid', [validarJWT,validarCampos], fotografiaGetId)

router.get('/', [validarJWT,validarCampos], fotografiaGet)

module.exports = router