const { Router } = require('express')
const { organizadorPost, organizadorCrearEvento, organizador_actualizar_evento, organizador_todos_eventos, organizador_agregar_fotografo_evento, organizador_suscripcion, organizador_quienes_asisteron_evento, organizador_cancelar_evento, organizador_permitir_las_fotos_son_publicas, organizador_permitir_las_fotos_solo_por_evento, organizador_permitir_las_fotos_solo_quienes_aparecen_evento, organizador_agregar_invitado_evento, perfil_organizador, organizadorGet } = require('../controllers/organizador.controller')
const { validarJWT } = require('../middlewaares/validarJWT.middleware')
const { validarCampos } = require('../middlewaares/validarCampos.middlewares')
const { existeUIdOrganizador, existeUIdFotografo, existeUIdInvitado } = require('../helpers/db-validator')
const { esOrganizadorRole } = require('../middlewaares/esOrganizadorRole.middleware')
const { check } = require('express-validator')
const router = Router()

router.get('/todos_los_eventos/:uid', [
    validarJWT,
    esOrganizadorRole,
    check('uid').custom(existeUIdOrganizador),
    validarCampos
], organizador_todos_eventos)

router.post('/', organizadorPost)
router.get('/',[validarJWT,validarCampos], organizadorGet)

router.post('/crear_evento/:organizador_uid', [
    validarJWT,
    esOrganizadorRole,
    check('organizador_uid').custom(existeUIdOrganizador),
    validarCampos
], organizadorCrearEvento)

router.post('/agregar_fotografo_evento/:fotografo_uid/:evento_uid', [
    validarJWT,
    esOrganizadorRole,
    check('fotografo_uid').custom(existeUIdFotografo),
    validarCampos
], organizador_agregar_fotografo_evento)

router.put('/actualizar_evento/:organizador_uid/:evento_uid', [
    validarJWT,
    esOrganizadorRole,
    check('organizador_uid').custom(existeUIdOrganizador),
    validarCampos
], organizador_actualizar_evento)

router.post('/suscripcion/:uid/:plan_suscripcion_uid', [
    validarJWT,
    esOrganizadorRole,
    validarCampos], organizador_suscripcion)

router.get('/lista_asistentes_evento/:evento_uid', [
    validarJWT,
    esOrganizadorRole,
    validarCampos
], organizador_quienes_asisteron_evento)


router.delete('/cancelar_evento/:evento_uid', [
    validarJWT,
    esOrganizadorRole,
    validarCampos
], organizador_cancelar_evento)

router.post('/suscripcion/:uid/:plan_suscripcion_uid', [
    validarJWT,
    esOrganizadorRole,
    validarCampos], organizador_suscripcion)

router.post('/fotografias_publicas/:uid/:evento_uid', [
    validarJWT,
    esOrganizadorRole,
    check('uid').custom(existeUIdOrganizador),
    validarCampos], organizador_permitir_las_fotos_son_publicas)

router.post('/permitir_las_fotos_solo_por_evento/:uid/:evento_uid', [
    validarJWT,
    esOrganizadorRole,
    check('uid').custom(existeUIdOrganizador),
    validarCampos], organizador_permitir_las_fotos_solo_por_evento)

router.post('/permitir_las_fotos_solo_quienes_aparecen_evento/:uid/:evento_uid', [
    validarJWT,
    esOrganizadorRole,
    check('uid').custom(existeUIdOrganizador),
    validarCampos], organizador_permitir_las_fotos_solo_quienes_aparecen_evento)

router.post('/agregar_invitado_evento/:invitado_uid/:evento_uid', [
    validarJWT,
    esOrganizadorRole,
    check('invitado_uid').custom(existeUIdInvitado),
    validarCampos
], organizador_agregar_invitado_evento)

router.get('/perfil/:uid', [
    validarJWT,
    esOrganizadorRole,
    check('uid').custom(existeUIdOrganizador),
    validarCampos
], perfil_organizador)


module.exports = router