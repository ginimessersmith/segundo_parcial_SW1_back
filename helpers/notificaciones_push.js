//?firebase
const axios = require('axios');

const { google } = require('googleapis');
const admin = require("firebase-admin");
const serviceAccount = require("../proysw1.json");
const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
const SCOPES = [MESSAGING_SCOPE];
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


function getAccessToken() {
    return new Promise(function (resolve, reject) {
        const key = require('../proysw1.json');
        const jwtClient = new google.auth.JWT(
            key.client_email,
            null,
            key.private_key,
            SCOPES,
            null
        );
        jwtClient.authorize(function (err, tokens) {
            if (err) {
                reject(err);
                return;
            }
            resolve(tokens.access_token);
        });
    });
}
const enviar_notificacion_push = async () => {
    try {
        const url = 'https://fcm.googleapis.com/v1/projects/proyecto1-sw1/messages:send';
        const token = await getAccessToken()
        const phone_token = "cNh_lKLaRt26HL_qZ0KwS8:APA91bFvzlTJ-ZzM3d2_GoawgUOZ3jZSagVZjP_rpoa2qmc26Mjx7nY36SaOcxmiPDH1k9kcr0OkXPv8lBrz-kcHxkv5wet-OwrdEbgCokc_zhYZ1Z-fMoc0UYS7IuQNhskQXpLIRR1Y"
        
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };
        const message = {
            "message": {
                "token": phone_token,
                "data": {},
                "notification": {
                    "title": "Aviso de la Plataforma",
                    "body": "Usted fue encontrado en una fotografia, por favor ingrese a la plataforma o a la aplicacion para verla",
                }
            }
        };
        const response = await axios.post(url, message, { headers });
        console.log('Notificación enviada con éxito:', response.data);
    } catch (error) {
        console.log('ERROR AL ENVIAR UNA NOTIFICACION: ', error)
    }
}

module.exports={enviar_notificacion_push}