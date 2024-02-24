const { Router } = require("express")
const { check } = require('express-validator')
const { invitadoGet, invitadoPost, invitadoPut, invitadoDelete, invitadoImgEntrenamiento, misImgEntrenamiento, invitado_seleccionar_evento, invitado_registra_luxand, invitado_suscripcion, invitado_ver_mis_fotografias, perfil_invitado, get_invitados, comprar_foto } = require("../controllers/invitado.controller")
const { validarJWT } = require("../middlewaares/validarJWT.middleware")
const { esInvitadoRole } = require("../middlewaares/esInvitadoRole.middleware")
const { validarCampos } = require("../middlewaares/validarCampos.middlewares")
const { existeUIdInvitado } = require("../helpers/db-validator")

const router = Router()
router.get('/mis_img_entrenamiento/:uid', [
    validarJWT,
    check('uid').custom(existeUIdInvitado),
    validarCampos], misImgEntrenamiento)

router.get('/perfil/:uid', [
    validarJWT,
    check('uid').custom(existeUIdInvitado),
    validarCampos], perfil_invitado)

router.post('/', invitadoPost)
router.get('/', [validarJWT, validarCampos], invitadoGet)

router.post('/entrenamiento_img/:uid', [
    validarJWT,
    check('uid').custom(existeUIdInvitado),
    validarCampos
], invitadoImgEntrenamiento)

router.put('/:uid', [
    validarJWT,
    check('uid').custom(existeUIdInvitado),
    validarCampos], invitadoPut)

router.delete('/:uid', [
    validarJWT,
    check('uid').custom(existeUIdInvitado),
    validarCampos], invitadoDelete)

router.post('/seleccionar_evento/:uid/:evento_uid', [
    validarJWT,
    esInvitadoRole,
    validarCampos]
    , invitado_seleccionar_evento)

router.post('/registrar_ia/:uid',
    [
        validarJWT,
        esInvitadoRole,
        check('uid').custom(existeUIdInvitado),
        validarCampos
    ], invitado_registra_luxand)

router.post('/suscripcion/:uid/:plan_suscripcion_uid', [
    validarJWT,
    esInvitadoRole,
    validarCampos], invitado_suscripcion)

router.post('/comprar_foto/:uid/:fotografia_uid', [
    validarJWT,
    esInvitadoRole,
    validarCampos], comprar_foto)

router.get('/mis_fotografias/:invitado_uid', [
    validarJWT,
    esInvitadoRole,
    check('invitado_uid').custom(existeUIdInvitado),
    validarCampos], invitado_ver_mis_fotografias)

module.exports = router