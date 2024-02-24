const { Router } = require('express')
const { albumPost, albumGetPorFotografo, albumGetPorEvento, albumGetId, albumGet } = require('../controllers/album.controller')
const { validarJWT } = require('../middlewaares/validarJWT.middleware')
const { validarCampos } = require('../middlewaares/validarCampos.middlewares')
const { esFotografoRole } = require('../middlewaares/esFotografoRole')
const router = Router()

router.post('/', [
    validarJWT,
    esFotografoRole,
    validarCampos],
    albumPost)

router.get('/', [
    validarJWT,
    validarCampos],
    albumGet)

router.get('/porFotografo/:fotografo_uid', [
    validarJWT,
    esFotografoRole,
    validarCampos],
    albumGetPorFotografo)

router.get('/porEvento/:evento_uid', [
    validarJWT,
    esFotografoRole,
    validarCampos],
    albumGetPorEvento)
router.get('/:uid', [
    validarJWT,
    esFotografoRole,
    validarCampos],
    albumGetId)

module.exports = router