const { Router } = require('express')
const { fotografoPost, fotografoPut, fotografoDelete, crearUnAlbumAsignarEvento, actualizarAlbum, asignarFotografiaAlbum, getAlbum, ver_eventos_asignado, fotografo_ver_mis_fotografias, fotografo_eliminar_album, fotografo_suscripcion, fotografo_eliminar_fotografia_album, perfil_fotografo, fotografoGet } = require('../controllers/fotografo.controller')
const { check } = require('express-validator')
const { esEmailValido, existeUIdFotografo } = require('../helpers/db-validator')
const { validarJWT } = require('../middlewaares/validarJWT.middleware')
const { validarCampos } = require('../middlewaares/validarCampos.middlewares')
const { esFotografoRole } = require('../middlewaares/esFotografoRole')
const router = new Router()



//* crear un fotografo:
router.get('/:fotografo_uid', [
    validarJWT,
    check('fotografo_uid').custom(existeUIdFotografo),
    validarCampos], getAlbum)

router.get('/ver_eventos/:uid', [
    validarJWT,
    esFotografoRole,
    check('uid').custom(existeUIdFotografo),
    validarCampos], ver_eventos_asignado)

router.get('/ver_fotografias/:fotografo_uid', [
    validarJWT,
    esFotografoRole,
    check('fotografo_uid').custom(existeUIdFotografo),
    validarCampos], fotografo_ver_mis_fotografias)

router.post('/', [
    check('correo_electronico', 'el correo no es valido').custom((correo_electronico) => esEmailValido(correo_electronico)),
], fotografoPost)

router.post('/crear_album__asignar_evento/:uid', [
    validarJWT,
    esFotografoRole,
    check('uid').custom(existeUIdFotografo),
    validarCampos
], crearUnAlbumAsignarEvento)

router.put('/:uid', [
    validarJWT,
    esFotografoRole,
    check('uid').custom(existeUIdFotografo),
    validarCampos
], fotografoPut)

router.put('/actualizar_album/:uid', [
    validarJWT,
    esFotografoRole,
    check('uid').custom(existeUIdFotografo),
    validarCampos
], actualizarAlbum)

router.post('/asignar_fotografia_album/:uid/:album_uid/:precio', [
    validarJWT,
    esFotografoRole,
    check('uid').custom(existeUIdFotografo),
    validarCampos
], asignarFotografiaAlbum)

router.delete('/:uid', [
    validarJWT,
    esFotografoRole,
    check('uid').custom(existeUIdFotografo),
    validarCampos
], fotografoDelete)

router.delete('/eliminar_album/:album_uid', [
    validarJWT,
    esFotografoRole,
    validarCampos
], fotografo_eliminar_album)

router.post('/suscripcion/:uid/:plan_suscripcion_uid', [
    validarJWT,
    esFotografoRole,
    validarCampos], fotografo_suscripcion)

router.delete('/eliminar__fotografia_album/:album_uid/:fotografia_uid', [
    validarJWT,
    esFotografoRole,
    validarCampos
], fotografo_eliminar_fotografia_album)

router.get('/perfil_fotografo/:uid', [
    validarJWT,
    esFotografoRole,
    check('uid').custom(existeUIdFotografo),
    validarCampos], perfil_fotografo)

router.get('/', [
    validarJWT,   
    validarCampos], fotografoGet)


module.exports = router