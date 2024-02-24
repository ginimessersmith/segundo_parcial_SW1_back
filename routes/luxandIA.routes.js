const { Router } = require('express')

const { validarJWT } = require('../middlewaares/validarJWT.middleware')
const { validarCampos } = require('../middlewaares/validarCampos.middlewares')
const { listPersonsinDatabase } = require('../controllers/luxandIA.controller')


const router = Router()

router.get('/listPersonsInDatabase', [validarJWT, validarCampos], listPersonsinDatabase)
//router.post('/', [validarJWT, validarCampos], luxandIAPost)

module.exports = router
