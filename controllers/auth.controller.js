const Organizador = require('../models/organizador.model')
const Fotografo = require('../models/fotografo.model')
const Invitado = require('../models/invitado.model')
const bcrypt = require('bcryptjs')
const { generarJWT } = require('../helpers/generar-jwt')
const axios = require('axios');
//?firebase:
// const { google } = require('googleapis');
// const admin = require("firebase-admin");
// const serviceAccount = require("../proysw1.json");
// const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
// const SCOPES = [MESSAGING_SCOPE];
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });

const authLoginPost = async (req, res) => {

    /**req: 
     * {
         "correo_electronico":"ginoOrganizador@live.com",
         "password":"abc123"
    }
     */

    const { correo_electronico, password } = req.body

    try {
        const organizadorData = await Organizador.findOne({ where: { correo_electronico } })
        //?console.log('el organizador es: ',organizadorData)
        const invitadoData = await Invitado.findOne({ where: { correo_electronico } })
        //?console.log('el invitado es: ',invitadoData)
        const fotografoData = await Fotografo.findOne({ where: { correo_electronico } })
        //?console.log('el fotografo es: ',fotografoData)

        // await enviar_notificacion()

        if (!organizadorData && !invitadoData && !fotografoData) {
            return res.status(400).json({
                mensaje: 'el correo no existe'
            })
        } else {

            if (organizadorData) {
                if (organizadorData.estado_suscripcion) {

                    const validarPassword = bcrypt.compareSync(password, organizadorData.password_user)
                    if (!validarPassword) {
                        return res.status(400).json({
                            mensaje: 'la contraseña del organizador es incorrecta'
                        })
                    }

                    const token = await generarJWT(organizadorData.uid)

                    const { uid,
                        fullname,
                        correo_electronico,
                        rol_user,
                        nro_telefono,
                        direccion,
                        foto_perfil_url,
                        estado_suscripcion,
                        es_activo } = organizadorData
                    return res.json({
                        uid,
                        fullname,
                        correo_electronico,
                        rol_user,
                        nro_telefono,
                        direccion,
                        foto_perfil_url,
                        estado_suscripcion,
                        es_activo,
                        token
                    })
                } else {
                    return res.status(400).json({
                        mensaje: 'el organizador existe pero no tiene una suscripcion valida'
                    })
                }

            }

            if (invitadoData) {
                if (invitadoData.estado_suscripcion) {

                    const validarPassword = bcrypt.compareSync(password, invitadoData.password_user)
                    if (!validarPassword) {
                        return res.status(400).json({
                            mensaje: 'la contraseña del invitado es incorrecta'
                        })
                    }
                    const token = await generarJWT(invitadoData.uid)

                    const { uid,
                        fullname,
                        correo_electronico,
                        rol_user,
                        nro_telefono,
                        direccion,
                        foto_perfil_url,
                        estado_suscripcion,
                        evento_uid } = invitadoData
                    return res.json({
                        uid,
                        fullname,
                        correo_electronico,
                        rol_user,
                        nro_telefono,
                        direccion,
                        foto_perfil_url,
                        estado_suscripcion,
                        evento_uid,
                        token
                    })

                } else {
                    return res.status(400).json({
                        mensaje: 'el invitado existe pero no tiene una suscripcion valida'
                    })
                }
            }
            if (fotografoData) {
                if (fotografoData.estado_suscripcion) {

                    const validarPassword = bcrypt.compareSync(password, fotografoData.password_user)
                    if (!validarPassword) {
                        return res.status(400).json({
                            mensaje: 'la contraseña del fotografo es incorrecta'
                        })
                    }

                    const token = await generarJWT(fotografoData.uid)
                    const { uid,
                        fullname,
                        correo_electronico,
                        rol_user,
                        nro_telefono,
                        tipo_fotografo,
                        foto_perfil_url,
                        direccion,
                        especialidad,
                        estado_suscripcion,
                        entidad,
                        permitido_en_evento,
                        evento_uid } = fotografoData
                    return res.json({
                        uid,
                        fullname,
                        correo_electronico,
                        rol_user,
                        nro_telefono,
                        tipo_fotografo,
                        foto_perfil_url,
                        direccion,
                        especialidad,
                        estado_suscripcion,
                        entidad,
                        permitido_en_evento,
                        evento_uid,
                        token
                    })
                } else {
                    return res.status(400).json({
                        mensaje: 'el fotografo existe pero no tiene una suscripcion valida'
                    })
                }
            }

        }


    } catch (error) {
        console.log(error)
        return res.status(400).json({
            mensaje: 'error al hacer un login'
        })
    }

}

//! PRUEBA PARA LAS NOTIFICACIONES PUSH
// //? firebase:
// function getAccessToken() {
//     return new Promise(function (resolve, reject) {
//         const key = require('../proysw1.json');
//         const jwtClient = new google.auth.JWT(
//             key.client_email,
//             null,
//             key.private_key,
//             SCOPES,
//             null
//         );
//         jwtClient.authorize(function (err, tokens) {
//             if (err) {
//                 reject(err);
//                 return;
//             }
//             resolve(tokens.access_token);
//         });
//     });
// }
// const enviar_notificacion = async () => {
//     try {
//         const url = 'https://fcm.googleapis.com/v1/projects/proyecto1-sw1/messages:send';
//         const token = await getAccessToken()
//         const phone_token = "cNh_lKLaRt26HL_qZ0KwS8:APA91bFvzlTJ-ZzM3d2_GoawgUOZ3jZSagVZjP_rpoa2qmc26Mjx7nY36SaOcxmiPDH1k9kcr0OkXPv8lBrz-kcHxkv5wet-OwrdEbgCokc_zhYZ1Z-fMoc0UYS7IuQNhskQXpLIRR1Y"
        
//         const headers = {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//         };
//         const message = {
//             "message": {
//                 "token": phone_token,
//                 "data": {},
//                 "notification": {
//                     "title": "Aviso de la Plataforma",
//                     "body": "Usted fue encontrado en una fotografia,porfavor ingrese a la plataforma para verla",
//                 }
//             }
//         };
//         const response = await axios.post(url, message, { headers });
//         console.log('Notificación enviada con éxito:', response.data);
//     } catch (error) {
//         console.log('ERROR AL ENVIAR UNA NOTIFICACION: ', error)
//     }
// }


module.exports = {
    authLoginPost
}