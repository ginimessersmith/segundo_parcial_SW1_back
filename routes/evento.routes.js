const { Router } = require('express')
const { eventoPost, eventoGetId, eventoGet } = require('../controllers/evento.controller')
const { esOrganizadorRole } = require('../middlewaares/esOrganizadorRole.middleware')
const { validarJWT } = require('../middlewaares/validarJWT.middleware')
const { validarCampos } = require('../middlewaares/validarCampos.middlewares')
const { check } = require('express-validator')
const router = Router()

router.post('/', [validarJWT, esOrganizadorRole, validarCampos], eventoPost)
router.get('/:uid', [
    validarJWT,
    validarCampos], eventoGetId)

router.get('/', [
    validarJWT,
    validarCampos], eventoGet)

module.exports = router