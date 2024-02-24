const {Router} = require('express')
const { authLoginPost } = require('../controllers/auth.controller')
const { check } = require('express-validator')
const { validarCampos } = require('../middlewaares/validarCampos.middlewares')

const router = Router()

router.post('/login',[
    check('correo_electronico','el correo es obligatorio').isEmail(),
    check('password','la contraseña es obligatorio y minimo 6 caracteres').notEmpty().isLength({min:6}),
    validarCampos
],authLoginPost)

module.exports=router