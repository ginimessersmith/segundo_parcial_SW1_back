const qr = require('qrcode')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const stripe = require('stripe')(process.env.STRIPE_KEY)
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET

})
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_GOOGLE,
        pass: process.env.PASS_GOOGLE,
    },
})
const axios = require('axios')

const Invitado = require("../models/invitado.model")
const Suscripcion = require("../models/suscripcion.model")
const Plan_suscripcion = require("../models/plan_suscripcion.model")
const FormData = require('form-data');
const Imagenes_entrenamiento = require("../models/imagenes_entrenamiento.model")
const { generarJWT } = require('../helpers/generar-jwt')
const { configDotenv } = require('dotenv');
const Evento = require('../models/evento.model');
const Fotografia = require('../models/fotografia.model')
const Album = require('../models/album.model')
const Invitado_fotografia = require('../models/invitado_fotografias.model')
const Fotografo = require('../models/fotografo.model')

//const {Response:res,Request:req} = require('express')
const invitadoGet = async (req, res) => {
    try {
        const todosLosInvitado = await Invitado.findAll({ attributes: { exclude: ['password_user'] } })
        res.json(todosLosInvitado)
    } catch (error) {
        console.log(error)
        res.status(404).json({ mensaje: 'error al obtener todos los invitados' })
    }
}

const invitadoGetId = async (req, res) => {
    res.json({
        mensaje: 'ruta invitado creada con exito'
    })
}

const invitadoPost = async (req, res) => {
    const { fullname,
        correo_electronico,
        password_user,
        confirmPassword } = req.body
    try {

        if (password_user == confirmPassword) {
            const salt = bcrypt.genSaltSync()
            const encryptPassword = bcrypt.hashSync(password_user, salt)

            const nuevoInvitado = await Invitado.create({
                fullname,
                correo_electronico,
                password_user: encryptPassword
            })
            const token = await generarJWT(nuevoInvitado.uid)

            

            res.json({
                nuevoInvitado,
                Suscripcion: nuevoInvitado.estado_suscripcion,
                token
            })

        } else {
            return res.json({
                mensaje: 'las contraseñas no son iguales'
            })
        }


    } catch (error) {

        console.log(error)
        res.json({
            mensaje: 'ocurrio un error al crear un invitado',
            ruta: 'invitadoPost'
        })
    }


}

const invitadoPut = async (req, res) => {
    const { uid } = req.params
    const { fullname,
        correo_electronico,
        password_user,
        confirmPassword,
        nro_telefono,
        direccion,
        evento_uid,
        estado_suscripcion
    } = req.body

    try {
        console.log('ESTADO SUSCRIPCIOONNNNNNNNNNNN',estado_suscripcion)
        const invitadoActualizar = await Invitado.findByPk(uid)

        if (!invitadoActualizar) {
            return res.status(404).json({
                mensaje: 'invitado no encontrado'
            })
        }

        if (password_user !== undefined && (password_user || password_user != '')) {

            if (password_user == confirmPassword) {

                const salt = bcrypt.genSaltSync()
                invitadoActualizar.password_user = bcrypt.hashSync(password_user, salt)

            } else {
                return res.status(400).json({
                    mensaje: 'no se pudo verificar las contraseñas, son distintas'
                })
            }

        }
        if (fullname) {
            invitadoActualizar.fullname = fullname
        }


        if (correo_electronico) {
            invitadoActualizar.correo_electronico = correo_electronico
        }

        if (nro_telefono) {
            invitadoActualizar.nro_telefono = nro_telefono
        }

        if (direccion) {
            invitadoActualizar.direccion = direccion
        }


        if (req.files && Object.keys(req.files).length !== 0 && req.files.archivo) {
            //? si viene un archivo
            ///? console.log('archivo:', req.files.archivo)

            if (invitadoActualizar.foto_perfil_url) {
                const urlArchivo = invitadoActualizar.foto_perfil_url.split('/')
                const nombre = urlArchivo[urlArchivo.length - 1]
                const [idArchivo, extensionArchivo] = nombre.split('.')
                await cloudinary.uploader.destroy('segundo_parcial_software1/' + idArchivo)
            }

            const { tempFilePath } = req.files.archivo
            const { secure_url } = await cloudinary.uploader.upload(tempFilePath, { folder: 'segundo_parcial_software1' },)
            invitadoActualizar.foto_perfil_url = secure_url
        }

        if (evento_uid) {
            invitadoActualizar.evento_uid = evento_uid
        }
        if (estado_suscripcion || estado_suscripcion ==false) {
            invitadoActualizar.estado_suscripcion = estado_suscripcion
        }

        await invitadoActualizar.save()
        res.json({ invitadoActualizar })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: 'hubo un error al actualizar el invitado'
        })
    }



}

const invitadoDelete = async (req, res) => {
    const { uid } = req.params

    try {
        const invitadoEliminar = await Invitado.findByPk(uid)
        if (invitadoEliminar) {
            invitadoEliminar.estado_suscripcion = false
            await invitadoEliminar.save()
            res.json({
                mensaje: 'eliminado con exito',
                invitadoEliminar
            })
        } else {
            return res.status(400).json({ mensaje: 'no se encontro el invitado a eliminar' })
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ mensaje: 'error al elimimar un invitado' })
    }
}

const invitadoImgEntrenamiento = async (req, res) => {
    const { uid } = req.params

    try {
        if (req.files && Object.keys(req.files).length !== 0 && req.files.archivo) {

            const unInvitado = await Invitado.findByPk(uid)
            const { tempFilePath } = req.files.archivo
            const { secure_url } = await cloudinary.uploader.upload(tempFilePath, { folder: 'segundo_parcial_software1' },)
            const { luxand_uuid } = unInvitado
            // console.log('nombre invitado', nombreInvitado)
            const respuetaAddFacesLuxand = await addFaceToThePerson(luxand_uuid, secure_url, '1')

            const nuevaImgEntrenamiento = await Imagenes_entrenamiento.create({
                img_url: secure_url,
                invitado_uid: uid
            })

            // res.json({ nuevaImgEntrenamiento,respuetaEnrollLuxand })
            const { status } = respuetaAddFacesLuxand
            if (status == 'failure') {
                return res.json({ mensaje: 'error al entrenar la imagen', respuetaAddFacesLuxand })
            }
            res.json({ nuevaImgEntrenamiento, respuetaAddFacesLuxand })

        } else {

            return res.status(400).json({ mensaje: 'no hay una imagen por subir' })

        }

    } catch (error) {
        console.log(error)
        res.json({ mensaje: 'erro al subir una imagen por parte del invitado' })
    }

}

const misImgEntrenamiento = async (req, res) => {
    const { uid } = req.params

    try {
        const { luxand_uuid } = await Invitado.findByPk(uid)
        const respuestaLuxand = await retrievePersonDetails(luxand_uuid)
        const listaImgEntrenamiento = await Imagenes_entrenamiento.findAll({
            where: {
                invitado_uid: uid
            }
        })

        res.json({ listaImgEntrenamiento, respuestaLuxand })

    } catch (error) {
        console.log(error)
        res.json({ mensaje: 'erro al obtener las img de entrenamiento del invitado' })
    }

}

const invitado_seleccionar_evento = async (req, res) => {
    const { uid, evento_uid } = req.params
    try {
        const unInvitado = await Invitado.findByPk(uid)
        const unEvento = await Evento.findByPk(evento_uid)
        if (unInvitado) {
            if (unEvento) {
                unInvitado.evento_uid = evento_uid
                await unInvitado.save()
                const { nombre_evento, descripcion, fecha } = unEvento
                const {fullname,correo_electronico}=unInvitado
                const {bufferQR} = await generarQR(uid,evento_uid)
                const correoSend= await enviarCorreoInvitacion(correo_electronico,unInvitado,unEvento,bufferQR)
                
                return res.json({
                    unInvitado,
                    Evento: nombre_evento,
                    descripcion,
                    fecha,
                    correoSend,
                    qr
                })

            } else {
                return res.status(404).json({ mensaje: 'No se pudo encontrar el evento' })
            }
        } else {

            return res.status(404).json({ mensaje: 'No se pudo encontrar al invitado' })
        }


    } catch (error) {

        console.log(error)
        res.status(404).json({
            mensaje: 'Error al seleccionar un evento por parte del invitado'
        })

    }

}

const seleccionar_suscripcion = async () => {

}

const invitado_registra_luxand = async (req, res) => {
    const { uid } = req.params

    try {
        const unInvitado = await Invitado.findByPk(uid)
        if (unInvitado) {
            const { luxand_uuid } = unInvitado
            if (luxand_uuid == null) {
                if (req.files && Object.keys(req.files).length !== 0 && req.files.archivo) {
                    const nombreInvitado = unInvitado.uid
                    const { tempFilePath } = req.files.archivo
                    const { secure_url } = await cloudinary.uploader.upload(tempFilePath, { folder: 'segundo_parcial_software1' })
                    const responseLuxand = await enrollPersonInLuxand(secure_url, nombreInvitado)
                    const { success } = responseLuxand
                    if (success == true) {
                        const { data } = responseLuxand
                        const { uuid } = data
                        unInvitado.luxand_uuid = uuid
                        await unInvitado.save()
                        res.json(unInvitado)

                    } else {
                        return res.status(404).json({ mensaje: 'Falla al registrar en luxand', responseLuxand })
                    }

                } else {
                    return res.status(404).json({ mensaje: 'debe venir un archivo en la request' })
                }

            } else {

                return res.status(404).json({ mensaje: 'el invitado ya esta registrado en luxand' })

            }
        } else {
            return res.status(404).json({ mensaje: 'el invitado no fue encontrado para el registro' })
        }

    } catch (error) {
        console.log(error)
        res.status(404).json({
            mensaje: 'error al resgistar en luxand'
        })
    }
}


const enrollPersonInLuxand = async (secure_url, name) => {
    try {
        //console.log('SECURE URLLLLLLLLLLLLLLLLLLLLL: ',secure_url)
        const responseImg = await axios({
            method: 'get',
            url: secure_url,
            responseType: 'arraybuffer',
        })

        const imageBuffer = Buffer.from(responseImg.data)

        const token = process.env.LUXAND_APIKEY
        const form = new FormData();
        form.append("photos", imageBuffer, { filename: "photo.jpg" });
        form.append("name", name);
        form.append("store", "1");
        form.append("collections", "invitado");

        const headers = {
            "token": token,
            'Content-Type': `multipart/form-data; boundary=${form.getBoundary()}`,
        };

        const response = await axios.post("https://api.luxand.cloud/v2/person", form, { headers });

        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.message || 'Error desconocido en Luxand' };
    }
}

const addFaceToThePerson = async (uuid, secure_url, store) => {
    try {

        const responseImg = await axios({
            method: 'get',
            url: secure_url,
            responseType: 'arraybuffer',
        })

        const url = `https://api.luxand.cloud/v2/person/${uuid}`
        const token = process.env.LUXAND_APIKEY
        const headers = {
            "token": token,
            'Content-Type': 'multipart/form-data',
        }
        const imageBuffer = Buffer.from(responseImg.data)

        //!
        const form = new FormData();
        form.append("photos", imageBuffer, { filename: "photo.jpg" })
        form.append("store", "1")

        if (store !== undefined) {
            form.append('store', store.toString())
        }

        headers['Content-Type'] = `multipart/form-data; boundary=${form.getBoundary()}`

        const options = {
            method: 'POST',
            url: url,
            headers: headers,
            data: form,
        }

        const response = await axios(options)
        return response.data

    } catch (error) {
        console.log(error)
        res.status(404).json({
            mensaje: 'error en la funcion Add faces to the person'
        })
    }
}

const retrievePersonDetails = async (uuid) => {
    try {
        const token = process.env.LUXAND_APIKEY
        const url = `https://api.luxand.cloud/v2/person/${uuid}`
        const headers = {
            "token": token,
            'Content-Type': 'multipart/form-data',
        }

        const form = new FormData()

        headers['Content-Type'] = `multipart/form-data; boundary=${form.getBoundary()}`

        const options = {
            method: "GET",
            url: url,
            headers: headers,
            data: form,
        }

        const response = await axios(options)
        console.log(response.data)
        return response.data

    } catch (error) {

        console.log(error)
        return {
            status: 404,
            mensaje: 'error al obtener los detalles del usuario de parte de luxand'
        }
    }
}

const invitado_suscripcion = async (req, res) => {
    const { uid, plan_suscripcion_uid } = req.params
    const token = req.header('x-token')
    try {
        const unInvitado = await Invitado.findByPk(uid)
        const unPlan = await Plan_suscripcion.findByPk(plan_suscripcion_uid)
        const { uid: uid_invitado,
            fullname,
            correo_electronico,
            rol_user,
            nro_telefono,
            direccion,

        } = unInvitado
        const { uid: uid_plan, nombre_plan, precio, periodicidad, descripcion } = unPlan
        if (unInvitado) {
            if (unPlan) {
                const line_items = [
                    {
                        price_data: {
                            product_data: {
                                name: `${nombre_plan}`,
                                description: `${descripcion}`
                            },
                            currency: 'usd',
                            unit_amount: `${precio * 100}`
                            //?unit_amount: 2000//? 20$
                        },
                        quantity: 1
                    },

                ]
                const pago = await payment(line_items)
                unInvitado.estado_suscripcion = true
                await unInvitado.save()
                const { cancel_url, url, success_url } = pago
                let fechaActual = new Date()
                fechaActual.setMilliseconds(0)
                const fecha_inicio = formatearFecha(fechaActual)
                const fecha_fin = calcularFechaFin(fecha_inicio, periodicidad)
                const nuevaSuscripcion = await Suscripcion.create({
                    fecha_inicio,
                    fecha_fin,
                    invitado_uid: uid,
                    plan_suscripcion_uid
                })

                if (correo_electronico == null) {
                    return res.json({
                        uid_invitado,
                        fullname,
                        correo_electronico,
                        rol_user,
                        nro_telefono,
                        direccion,
                        uid_plan,
                        nombre_plan,
                        precio,
                        periodicidad,
                        descripcion,
                        cancel_url,
                        success_url,
                        url,
                        fecha_inicio,
                        fecha_fin,
                        nuevaSuscripcion,
                        token
                    })
                }

                const contenidoSuscripcion = ` 
                Hola ${fullname}, Usted a adquirido una suscripcion en nuestra plataforma.
                Los detalles son:

                Nombre del Plan: ${nombre_plan}
                Descripcion: ${descripcion}
                Periodo: ${periodicidad}
                Precio: ${precio}$
                Fecha de Inicio: ${fecha_inicio}
                
                Su plan caduca la siguiente fecha: ${fecha_fin}
                `

                const respuestaCorreo = await enviarCorreo(correo_electronico, contenidoSuscripcion)

                res.json({
                    uid_invitado,
                    fullname,
                    correo_electronico,
                    rol_user,
                    nro_telefono,
                    direccion,
                    uid_plan,
                    nombre_plan,
                    precio,
                    periodicidad,
                    descripcion,
                    cancel_url,
                    success_url,
                    url,
                    fecha_inicio,
                    fecha_fin,
                    nuevaSuscripcion,
                    respuestaCorreo,
                    token
                })
            } else {
                return res.status(404).json({ mensaje: 'no se encontro el plan de suscripcion' })
            }
        } else {
            return res.status(404).json({ mensaje: 'no se encontro el invitado' })
        }

    } catch (error) {
        console.log(error)
        res.status(404).json({ mensaje: 'erro al suscribir un invitado' })
    }
}

const comprar_foto = async (req, res) => {
    const { uid, fotografia_uid } = req.params
    try {
        const unaFoto = await Fotografia.findByPk(fotografia_uid)
        const unInvitado = await Invitado.findByPk(uid)
        if (unaFoto) {
            if (unInvitado) {
                const { uid: uid_invitado, fullname, correo_electronico } = unInvitado
                const { uid: uid_foto, img_url, precio, album_uid } = unaFoto
                const unAlbum = await Album.findByPk(album_uid)
                if (unAlbum) {
                    const { evento_uid } = unAlbum
                    const unEvento = await Evento.findByPk(evento_uid)
                    if (unEvento) {
                        const { nombre_evento, descripcion } = unEvento
                        const line_items = [
                            {
                                price_data: {
                                    product_data: {
                                        name: `Fotografia`,
                                        description: `Evento: ${nombre_evento}, Descripcion del evento: ${descripcion}`
                                    },
                                    currency: 'usd',
                                    unit_amount: `${precio * 100}`
                                    //?unit_amount: 2000//? 20$
                                },
                                quantity: 1
                            },

                        ]
                        const pago = await payment(line_items)
                        const { cancel_url, url, success_url } = pago
                        unaFoto.esta_pagada=true
                        await unaFoto.save()
                        const contenido = ` 
                        Hola ${fullname}, Usted a comprado una fotografia en nuestra plataforma.
                        Los detalles son:

                        Evento: ${nombre_evento}
                        Descripcion del Evento: ${descripcion}                
                        Precio: ${precio}$
                        `
                        const respuestaCorreo = await enviarCorreo(correo_electronico, contenido)
                        return res.json({
                            img_url,
                            success_url,
                            cancel_url,
                            url,
                            respuestaCorreo
                        })
                    } else {
                        const line_items = [
                            {
                                price_data: {
                                    product_data: {
                                        name: `Fotografia`,
                                        description: `Esta es su fotografia seleccionada`
                                    },
                                    currency: 'usd',
                                    unit_amount: `${precio * 100}`
                                    //?unit_amount: 2000//? 20$
                                },
                                quantity: 1
                            },

                        ]
                        const pago = await payment(line_items)
                        const { cancel_url, url, success_url } = pago
                        const contenido = ` 
                            Hola ${fullname}, Usted a comprado una fotografia en nuestra plataforma.
                            Los detalles son:          
                            Precio: ${precio}$
                            `
                        const respuestaCorreo = await enviarCorreo(correo_electronico, contenido)
                        return res.json({
                            img_url,
                            success_url,
                            cancel_url,
                            url,
                            respuestaCorreo
                        })

                    }
                } else {
                    const line_items = [
                        {
                            price_data: {
                                product_data: {
                                    name: `Fotografia`,
                                    description: `Esta es su fotografia seleccionada`
                                },
                                currency: 'usd',
                                unit_amount: `${precio * 100}`
                                //?unit_amount: 2000//? 20$
                            },
                            quantity: 1
                        },

                    ]

                    const pago = await payment(line_items)
                    const { cancel_url, url, success_url } = pago
                    const contenido = ` 
                         Hola ${fullname}, Usted a comprado una fotografia en nuestra plataforma.
                         Los detalles son:
            
                            Precio: ${precio}$
                            `
                    const respuestaCorreo = await enviarCorreo(correo_electronico, contenido)
                    return res.json({
                        img_url,
                        success_url,
                        cancel_url,
                        url,
                        respuestaCorreo
                    })
                }


            } else {
                return res.json({ mensaje: 'no existe el invitado' })
            }

        } else {
            return res.json({ mensaje: 'no existe la fotografia' })
        }

    } catch (error) {
        console.log(error)
        res.status(404).json({ mensaje: 'error al intentar comprar una foto' })
    }
}


const payment = async (line_items) => {
    const pago = await stripe.checkout.sessions.create({
        line_items: line_items,
        mode: 'payment',
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_CANCEL_URL,
    })
    return pago
}

const calcularFechaFin = (fechaInicio, periodicidad) => {
    const fechaFin = new Date(fechaInicio)


    switch (periodicidad.toLowerCase()) {
        case '1 año':
            fechaFin.setFullYear(fechaFin.getFullYear() + 1)
            break
        case '6 meses':
            fechaFin.setMonth(fechaFin.getMonth() + 6)
            break
        case '3 meses':
            fechaFin.setMonth(fechaFin.getMonth() + 3)
            break
        case '1 mes':
            fechaFin.setMonth(fechaFin.getMonth() + 1)
            break
        default:

            break
    }

    return formatearFecha(fechaFin)
}

const formatearFecha = (fecha) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
    return fecha.toLocaleDateString('en-US', options).replace(/\//g, '-')
}

const enviarCorreo = async (destinatario, contenidoSuscripcion) => {
    try {
        const contenido = contenidoSuscripcion

        const asunto = `Plan de Suscripcion`
        const mailOptions = {
            from: process.env.EMAIL_GOOGLE,
            to: destinatario,
            subject: asunto,
            text: contenido,
        }

        const info = await transporter.sendMail(mailOptions)
        console.log('correo enviado con exito')
        return {
            success: true,
            status: 200,
            mensaje: 'Correo electrónico enviado con éxito',
            info,
        };

    } catch (error) {
        console.log(error)
        return {
            success: false,
            status: 404,
            mensaje: 'No se pudo enviar el correo electrónico',
            error: error.message,
        }
    }
}
const enviarCorreoInvitacion = async (destinatario,unInvitado,unEvento,buffer ) => {
    try {
        const{nombre_evento,descripcion}=unEvento
        const{fullname}=unInvitado
        const contenidoHTML = `
            <html>
                <body>
                    <p>Hola ${fullname}, usted fue invitado al evento:</p>
                    <p>${nombre_evento}</p>
                    <p>Descripción: ${descripcion}</p>
                    <p>Código QR</p>

                    <img src="cid:codigoQR" alt="Código QR">
                    
                </body>
            </html>
        `

        const asunto = `Invitacion a un Evento`
        const mailOptions = {
            from: process.env.EMAIL_GOOGLE,
            to: destinatario,
            subject: asunto,
            html: contenidoHTML,
            attachments: [
                {
                    filename: 'codigoQR.png',
                    content: buffer,
                    encoding: 'base64',
                    cid: 'codigoQR'
                }
            ]
        }

        const info = await transporter.sendMail(mailOptions)
        console.log('correo enviado con exito')
        return {
            success: true,
            status: 200,
            mensaje: 'Correo electrónico enviado con éxito',
            info,
        };

    } catch (error) {
        console.log(error)
        return {
            success: false,
            status: 404,
            mensaje: 'No se pudo enviar el correo electrónico',
            error: error.message,
        }
    }
}

const invitado_ver_mis_fotografias = async (req, res) => {
    const { invitado_uid } = req.params
    try {
        const unInvitado = await Invitado.findByPk(invitado_uid)
        const { evento_uid } = unInvitado
        const listaFotografiasPublicas = await Fotografia.findAll({ where: { opcion_organizador_publica: true } })

        const listaFotografiasApareceInvitado = await Invitado_fotografia.findAll({
            where: {
                invitado_uid,
                op_organizador_vean_invitado_fotografia: true
            }
        })

        const filtrarlistaFotografiasApareceInvitado = []

        for (let unaFotografia of listaFotografiasApareceInvitado) {
            const { fotografia_uid: uid_foto } = unaFotografia
            const infoFoto = await Fotografia.findByPk(uid_foto)
            const { img_url, fecha_creacion, album_uid, criterio_calidad,esta_pagada } = infoFoto

            const infoAlbum = await Album.findByPk(album_uid)

            if (infoAlbum) {
                const { nombre_album, descripcion: descrip_album, uid: uid_album, evento_uid } = infoAlbum
                const infoEvento = await Evento.findByPk(evento_uid)
                if (infoEvento) {
                    const { nombre_evento, descripcion: descrip_evento } = infoEvento
                    const nuevoJson = {
                        img_url,
                        fecha_creacion,
                        nombre_album,
                        criterio_calidad,
                        esta_pagada,
                        descripcion_album: descrip_album,
                        nombre_evento,
                        descripcion_evento: descrip_evento
                    }
                    filtrarlistaFotografiasApareceInvitado.push(nuevoJson)
                } else {
                    const nuevoJson = {
                        img_url,
                        fecha_creacion,
                        nombre_album,
                        esta_pagada,
                        descripcion_album: descrip_album,
                        nombre_evento: 'no tiene evento',
                        descripcion_evento: 'no tiene'
                    }
                    filtrarlistaFotografiasApareceInvitado.push(nuevoJson)
                }


            } else {

                const nuevoJson = {
                    img_url,
                    fecha_creacion,
                    esta_pagada,
                    nombre_album: 'no tiene album',
                    descripcion_album: 'no hay descripcion',
                    nombre_evento: 'no tiene evento',
                    descripcion_evento: 'no tiene'
                }
                filtrarlistaFotografiasApareceInvitado.push(nuevoJson)

            }

            


        }


        const listaAlbum = await Album.findAll({ where: { evento_uid: evento_uid } })
        let listaFotosPorEvento = []
        const unEvento = await Evento.findByPk(evento_uid)
        listaFotosPorEvento.push(unEvento)
        for (let album of listaAlbum) {
            const { uid: uid_album } = album
            const fotografiasAlbum = await Fotografia.findAll({ where: { album_uid: uid_album, opcion_organizador_fotos_solo_por_evento: true } })
            listaFotosPorEvento.push(fotografiasAlbum)
        }
        listaFotosPorEvento = listaFotosPorEvento.flat()
        res.json({ listaFotografiasPublicas, filtrarlistaFotografiasApareceInvitado, listaFotosPorEvento })
    } catch (error) {
        console.log(error)
        res.status(404).json({
            mensaje: 'Error al obtener las  fotografias'
        })
    }
}

const perfil_invitado = async (req, res) => {
    const { uid } = req.params

    try {
        const unInvitado = await Invitado.findByPk(uid)
        const { fullname,
            correo_electronico,
            rol_user,
            nro_telefono,
            direccion,
            foto_perfil_url,
            estado_suscripcion,
            evento_uid,
            disponibilidad_evento

        } = unInvitado
        const unEvento = await Evento.findByPk(evento_uid)
        if (unEvento) {
            const { nombre_evento, descripcion } = unEvento
            res.json({
                uid, fullname,
                correo_electronico,
                rol_user,
                nro_telefono,
                direccion,
                foto_perfil_url,
                estado_suscripcion,
                nombre_evento,
                descripcion_evento: descripcion,
                disponibilidad_evento
            })
        } else {
            res.json({
                uid, fullname,
                correo_electronico,
                rol_user,
                nro_telefono,
                direccion,
                foto_perfil_url,
                estado_suscripcion,
                evento_uid: null,
                disponibilidad_evento
            })
        }


    } catch (error) {
        console.log(error)
        res.status(404).json({
            mensaje: 'Error al obtener el perfil'
        })
    }

}

const get_invitados = async (req, res) => {
    const { uid } = req.params
    try {
        const unInvitado = await Invitado.findByPk(uid)
        res.json(unInvitado)
    } catch (error) {
        console.log(error)
        res.status(404).json({ mensaje: 'error al buscar un invitado' })
    }
}

const generarQR = async (uuid_user, uuid_evento) => {

    try {

        const invitado = await Invitado.findByPk(uuid_user)
        const evento = await Evento.findByPk(uuid_evento)
        const { nombre_evento, descripcion } = evento
        const { fullname,correo_electronico } = invitado
        if (!invitado || !evento) {
            return {
                mensaje: 'Invitado o evento no encontrado',
                status: 404
            }
        }
        // const mensaje =`Nombre : ${fullname} , evento: ${nombre_evento}`
        const mensaje =`http://sw1-segundo-parcial.s3-website.us-east-2.amazonaws.com/asistence`
        const datosQR = JSON.stringify(mensaje)

        //const urlQRCode = await qr.toDataURL(datosQR)
        const bufferQR = await qr.toBuffer(datosQR, { type: 'png' })
        return { success: true, bufferQR }

    } catch (error) {
        console.log(error)
        return {
            mensaje: 'error al generar un qr',
            status: 404
        }
    }

}
module.exports = {
    invitadoGet,
    invitadoDelete,
    invitadoGetId,
    invitadoPost,
    invitadoPut,
    invitadoImgEntrenamiento,
    misImgEntrenamiento,
    invitado_seleccionar_evento,
    seleccionar_suscripcion,
    invitado_registra_luxand,
    invitado_suscripcion,
    invitado_ver_mis_fotografias,
    perfil_invitado,
    get_invitados,
    comprar_foto
}