const bcrypt = require('bcryptjs')
const stripe = require('stripe')(process.env.STRIPE_KEY)
const fs = require('fs');
const axios = require('axios')
const nodemailer = require('nodemailer')
const Fotografo = require("../models/fotografo.model")
const Album = require("../models/album.model")
const FormData = require('form-data');
const Evento = require("../models/evento.model")
const { generarJWT } = require('../helpers/generar-jwt')
const Fotografia = require('../models/fotografia.model')
const Suscripcion = require("../models/suscripcion.model")
const Plan_suscripcion = require("../models/plan_suscripcion.model")
const Invitado_fotografia = require("../models/invitado_fotografias.model");
const Invitado = require('../models/invitado.model');
const { enviar_notificacion_push } = require('../helpers/notificaciones_push');

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


const fotografoPost = async (req, res) => {
    const {
        fullname,
        correo_electronico,
        password_user,
        confirmPassword,
        tipo_fotografo,
        evento_uid

    } = req.body

    try {

        if (password_user == confirmPassword) {

            const salt = bcrypt.genSaltSync()
            const encryptPassword = bcrypt.hashSync(password_user, salt)

            if (evento_uid && evento_uid != '') {
                const nuevoFotografo = await Fotografo.create({
                    fullname,
                    correo_electronico,
                    password_user: encryptPassword,
                    tipo_fotografo,
                    evento_uid

                })
                const token = await generarJWT(nuevoFotografo.uid)
                console.log('fotografo creado correctamente')

                res.json({
                    nuevoFotografo,
                    token
                })
            } else {
                const nuevoFotografo = await Fotografo.create({
                    fullname,
                    correo_electronico,
                    password_user: encryptPassword,
                    tipo_fotografo,


                })
                const token = await generarJWT(nuevoFotografo.uid)
                console.log('fotografo creado correctamente')

                res.json({
                    nuevoFotografo,
                    token
                })
            }




        } else {

            return res.json({
                mensaje: 'las contraseñas no son iguales'
            })

        }

    } catch (error) {
        console.log(error)
        res.json({
            mensaje: 'error al crear un nuevo fotografo'
        })
    }
}
const fotografoGet = async (req, res) => {
    try {
        const todosLosFotografos = await Fotografo.findAll({ attributes: { exclude: ['password_user'] } })
        res.json(todosLosFotografos)
    } catch (error) {
        console.log(error)
        res.status(404).json({ mensaje: 'error al obtener todos los fotografos' })
    }
}
const fotografoGetId = async (req, res) => { }

const fotografoPut = async (req, res) => {
    try {

        const { uid } = req.params
        const {
            fullname,
            correo_electronico,
            password_user,
            confirmPassword,
            nro_telefono,
            tipo_fotografo,
            direccion,
            especialidad,
            estado_suscripcion,
            entidad,
            evento_uid
        } = req.body

        const fotografoActualizar = await Fotografo.findByPk(uid)

        if (!fotografoActualizar) {
            return res.status(404).json({
                mensaje: 'no se encontro el fotografo a actualizar'
            })
        }

        if (password_user !== undefined && (password_user || password_user != '')) {

            if (password_user == confirmPassword) {
                const salt = bcrypt.genSaltSync()
                fotografoActualizar.password_user = bcrypt.hashSync(password_user, salt)
            } else {
                return res.status(400).json({
                    mensaje: 'no se pudo verificar las contraseñas, son distintas'
                })
            }
        }

        if (fullname) {
            fotografoActualizar.fullname = fullname
        }
        if (correo_electronico) {
            fotografoActualizar.correo_electronico = correo_electronico
        }
        if (tipo_fotografo) {
            fotografoActualizar.tipo_fotografo = tipo_fotografo
        }

        if (req.files && Object.keys(req.files).length !== 0 && req.files.archivo) {

            if (fotografoActualizar.foto_perfil_url) {
                const urlArchivo = fotografoActualizar.foto_perfil_url.split('/')
                const nombre = urlArchivo[urlArchivo.length - 1]
                const [idArchivo, extensionArchivo] = nombre.split('.')
                await cloudinary.uploader.destroy('segundo_parcial_software1/' + idArchivo)
            }

            const { tempFilePath } = req.files.archivo
            const { secure_url } = await cloudinary.uploader.upload(tempFilePath, { folder: 'segundo_parcial_software1' })
            fotografoActualizar.foto_perfil_url = secure_url
        }

        if (direccion) {
            fotografoActualizar.direccion = direccion
        }
        if (especialidad) {
            fotografoActualizar.especialidad = especialidad
        }
        if (estado_suscripcion) {
            fotografoActualizar.estado_suscripcion = estado_suscripcion
        }
        if (entidad) {
            fotografoActualizar.entidad = entidad
        }
        if (evento_uid) {
            fotografoActualizar.evento_uid = evento_uid
        }
        if (nro_telefono) {
            fotografoActualizar.nro_telefono = nro_telefono
        }

        await fotografoActualizar.save()
        res.json({ fotografoActualizar })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: 'hubo un error al actualizar un fotografo'
        })

    }
}
const fotografoDelete = async (req, res) => { }

const crearUnAlbumAsignarEvento = async (req, res) => {
    //? ignorar fotografia_uid
    const { uid } = req.params
    const {
        nombre_album,
        descripcion,
        evento_uid,
        precio

    } = req.body

    try {


        if (evento_uid) {
            const nuevoAlbum = await Album.create({
                nombre_album,
                descripcion,
                evento_uid,
                fotografo_uid: uid,
                precio
            })

            res.json({
                mensaje: 'se a creado un nuevo album',
                nuevoAlbum
            })

        } else {
            const nuevoAlbum = await Album.create({
                nombre_album,
                descripcion,
                fotografo_uid: uid,
                precio
            })

            res.json({
                mensaje: 'se a creado un nuevo album',
                nuevoAlbum
            })
        }




    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: 'error al crear un album'
        })
    }
}

const actualizarAlbum = async (req, res) => {
    try {

        const {
            uid_album,
            nombre_album,
            descripcion,
            evento_uid,
            precio } = req.body

        const albumActualizar = await Album.findByPk(uid_album)
        if (albumActualizar) {

            if (nombre_album) {
                albumActualizar.nombre_album = nombre_album
            }

            if (descripcion) {
                albumActualizar.descripcion = descripcion
            }

            if (evento_uid) {
                const eventoExiste = await Evento.findByPk(evento_uid)
                if (eventoExiste) {
                    albumActualizar.evento_uid = evento_uid
                } else {
                    return res.status(404).json({
                        mensaje: 'no se encontro el evento que desea actualizar'
                    })
                }

            }

            if (precio) {
                albumActualizar.precio = precio
            }

            await albumActualizar.save()
            res.json({ albumActualizar })

        } else {
            return res.status(404).json({
                mensaje: 'no se encontro el album'
            })
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: 'error al actualizar un album'
        })
    }
}

const asignarFotografiaAlbum = async (req, res) => {
    try {
        const { uid, album_uid } = req.params
        const precio = parseInt(req.params.precio, 10)

        const albumAsignar = await Album.findByPk(album_uid)

        if (albumAsignar) {
            if (req.files && Object.keys(req.files).length !== 0 && req.files.archivo) {

                const { tempFilePath } = req.files.archivo
                const { bytes, secure_url } = await cloudinary.uploader.upload(tempFilePath, { folder: 'segundo_parcial_software1' })

                const respuestaBusquedaPersonas = await searchAllPeopleInAPhoto(secure_url)
                const listaUUD = await obtenerListaNombresInvitadosUUID(respuestaBusquedaPersonas)
                const correos = await enviarCorreoAInvitados(listaUUD)
                await enviar_notificacion_push()
                if (bytes >= 70000) {
                    const nuevaFotografia = await Fotografia.create({
                        img_url: secure_url,
                        fotografo_uid: uid,
                        album_uid,
                        criterio_calidad: 'muy buena',
                        precio,

                    })

                    const asigancionInvitadosFotos = await agregarInvitadoFotografia(listaUUD, nuevaFotografia.uid)

                    if (albumAsignar.precio !== null) {
                        albumAsignar.precio = albumAsignar.precio + precio

                    } else {
                        albumAsignar.precio = precio
                    }


                    await albumAsignar.save()

                    return res.json({ nuevaFotografia })
                }

                if (bytes >= 50000 && bytes < 70000) {
                    const nuevaFotografia = await Fotografia.create({
                        img_url: secure_url,
                        fotografo_uid: uid,
                        album_uid,
                        criterio_calidad: 'buena',
                        precio
                    })

                    if (albumAsignar.precio !== null) {
                        albumAsignar.precio = albumAsignar.precio + precio

                    } else {
                        albumAsignar.precio = precio
                    }

                    await albumAsignar.save()

                    return res.json({ nuevaFotografia, })
                }

                if (bytes >= 20000 && bytes < 50000) {
                    const nuevaFotografia = await Fotografia.create({
                        img_url: secure_url,
                        fotografo_uid: uid,
                        album_uid,
                        criterio_calidad: 'mala',
                        precio
                    })

                    if (albumAsignar.precio !== null) {
                        albumAsignar.precio = albumAsignar.precio + precio

                    } else {
                        albumAsignar.precio = precio
                    }
                    await albumAsignar.save()
                    return res.json({ nuevaFotografia, })
                }

                if (bytes < 20000) {
                    const nuevaFotografia = await Fotografia.create({
                        img_url: secure_url,
                        fotografo_uid: uid,
                        album_uid,
                        criterio_calidad: 'muy mala',
                        precio
                    })

                    if (albumAsignar.precio !== null) {
                        albumAsignar.precio = albumAsignar.precio + precio

                    } else {
                        albumAsignar.precio = precio
                    }
                    await albumAsignar.save()

                    return res.json({ nuevaFotografia, })
                }

            } else {
                return res.status(400).json({
                    mensaje: 'no hay una foto que subir'
                })
            }


        } else {
            return res.status(400).json({
                mensaje: 'no se encontro el album a asignar'
            })
        }


    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: 'error al asignar una fotografia a un album'
        })
    }

}

const obtenerListaNombresInvitadosUUID = async (respuestaLuxand) => {
    try {
        const nombreUnicos = new Set()
        respuestaLuxand.forEach((item) => {
            nombreUnicos.add(item.name)
        })
        //console.log('EL SET ES',nombreUnicos)   
        return Array.from(nombreUnicos)

    } catch (error) {
        console.log('EL ERROR ES: ', error)
    }
}

const agregarInvitadoFotografia = async (listaUUID, uuid_fotografia) => {
    try {
        if (listaUUID.length > 0) {
            const promesasCreacion = listaUUID.map((uuid_invitado) => {
                return Invitado_fotografia.create({
                    invitado_uid: uuid_invitado,
                    fotografia_uid: uuid_fotografia
                })
            })
            const invitaFotos = await Promise.all(promesasCreacion)
            return {
                success: true,
                message: 'Invitados asociados correctamente.',
                invitadoFotografias: invitaFotos
            }
        }

        return {
            success: true,
            message: 'No hay invitados asociados',
           
        }

    } catch (error) {
        console.log(error)

        return {
            success: false,
            mensaje: 'error al agregar a la tabla invitado_fotografia',
            status: 404
        }

    }
}

const getAlbum = async (req, res) => {
    const { fotografo_uid } = req.params
    try {
        const albunes = await Album.findAll({
            where: {
                fotografo_uid: fotografo_uid,
                disponibilidad: true
            }
        })
        let todosLosAlbunes = []
        for (let album of albunes) {
            const fotografias = await Fotografia.findAll({
                attributes: ['uid', 'img_url', 'fecha_creacion', 'album_uid', 'criterio_calidad', 'precio', 'disponibilidad_album', 'esta_pagada'],
                where: { album_uid: album.uid, disponibilidad_album: true },
            });

            const { evento_uid } = album
            const unEvento = await Evento.findByPk(evento_uid)
            const { nombre_evento, descripcion: descripcion_evento, fecha: fecha_evento } = unEvento

            const albunConFotografia = {
                uid: album.uid,
                nombre_album: album.nombre_album,
                descripcion: album.descripcion,
                nombre_evento,
                descripcion_evento,
                fecha_evento,
                fotografo_uid: album.fotografo_uid,
                disponibilidad: album.disponibilidad,
                precio: album.precio,
                fotografias: fotografias.map((foto) => ({
                    uid: foto.uid,
                    img_url: foto.img_url,
                    fecha_creacion: foto.fecha_creacion,
                    album_uid: foto.album_uid,
                    criterio_calidad: foto.criterio_calidad,
                    precio: foto.precio,
                    disponibilidad_album: foto.disponibilidad_album,
                    esta_pagada: foto.esta_pagada
                })),
            }
            todosLosAlbunes.push(albunConFotografia)
        }
        //*const correo = await enviarCorreo('ginobaptista@gmal.com','ginoooooo')/
        //?https://res.cloudinary.com/dcysqd4ad/image/upload/v1700449723/segundo_parcial_software1/mqhxxnqooo86tlcnu0rl.jpg
        //const respuesta = await searchAllPeopleInAPhoto('https://res.cloudinary.com/dcysqd4ad/image/upload/v1700449723/segundo_parcial_software1/mqhxxnqooo86tlcnu0rl.jpg')
        res.json({ todosLosAlbunes })
    } catch (error) {
        console.log(error)
        res.status(400).json({ mensaje: 'error al traer todos los albunes con sus fotografias' })

    }
}

const ver_eventos_asignado = async (req, res) => {
    const { uid } = req.params

    try {
        const fotografo = await Fotografo.findByPk(uid)

        if (fotografo) {
            const evento = await Evento.findByPk(fotografo.evento_uid)
            const { permitir_en_evento, esta_activo } = fotografo

            if (permitir_en_evento && esta_activo) {
                return res.json({
                    evento
                })
            }
            return res.status(401).json({
                mensaje: 'no esta permitido en este evento o el evento fue cancelado'
            })
        } else {
            return res.status(404).json({ mensaje: 'no tiene ningun evento asignado' })
        }

    } catch (error) {
        console.log(error)
        res.status(404).json({
            mensaje: 'error al obtener todos los eventos '
        })
    }
}

const fotografo_ver_mis_fotografias = async (req, res) => {
    const { fotografo_uid } = req.params
    try {
        const listaFotografias = await Fotografia.findAll({ where: { fotografo_uid: fotografo_uid } })

        res.json({ listaFotografias })
    } catch (error) {
        console.log(error)
        res.json({
            mensaje: 'error al obtener las fotografias de un fotografo'
        })
    }

}

const fotografo_eliminar_album = async (req, res) => {
    const { album_uid } = req.params

    try {

        const unAlbum = await Album.findByPk(album_uid)
        if (unAlbum) {

            unAlbum.disponibilidad = false
            await unAlbum.save()

            const fotografiasDelAlbum = await Fotografia.findAll({ where: { album_uid: album_uid } })

            for (let unaFoto of fotografiasDelAlbum) {
                //unaFoto.visibilidad = false
                unaFoto.disponibilidad_album = false
                await unaFoto.save()
            }

            const { uid, nombre_album, descripcion, evento } = unAlbum
            res.json({
                mensaje: 'Se elimino con exito el ALbum',
                uid,
                nombre_album,
                descripcion,
                evento
            })
        } else {
            res.status(404).json({
                mensaje: 'no se encontro el album a eliminar'
            })
        }


    } catch (error) {
        console.log(error)
        res.status(404).json({
            mensaje: 'Error al eliminar un album de parte de un fotografo'
        })
    }
}

const enviarCorreo = async (destinatario, nombre_usuario) => {
    try {
        const contenido = ` Hola ${nombre_usuario}, usted fue reconocido en una fotografia de un evento al que asistio, por favor vaya a la plaforma para ver su fotografia`

        const asunto = `Deteccion de Rostros`
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

const enviarCorreoAInvitados = async (listaUUID) => {
    try {
        let listaEnvios = []
        if(listaUUID.length>0){
            for (let uuid of listaUUID) {
                const unInvitado = await Invitado.findByPk(uuid)
                const { correo_electronico, fullname } = unInvitado
                const correoEnviado = await enviarCorreo(correo_electronico, fullname)
                listaEnvios.push(correoEnviado)
            }
    
            return {
                mensaje: 'correos enviados',
                listaEnvios
            }
        }else{
            
            return {
                mensaje: 'no hay a quien enviar correos',
                listaEnvios
            }
        }
        
    } catch (error) {
        console.log(error)
        return {
            success: false,
            mensaje: 'error la enviar los correos electronicos',
            status: 404
        }
    }
}
const enviarCorreoSuscripcion = async (destinatario, contenidoSuscripcion) => {
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

const recognizePeopleInAPhoto = async (secure_url, collections) => {
    try {

        const responseImg = await axios({
            method: 'get',
            url: secure_url,
            responseType: 'arraybuffer',
        })

        const imageBuffer = Buffer.from(responseImg.data)

        const url = 'https://api.luxand.cloud/photo/search/v2'
        const token = process.env.LUXAND_APIKEY

        const form = new FormData()
        form.append("photos", imageBuffer, { filename: "photo.jpg" })
        form.append("collections", collections)

        const headers = {
            "token": token,
            'Content-Type': `multipart/form-data; boundary=${form.getBoundary()}`,
            'Accept': 'application/json'
        }

        const options = {
            method: "POST",
            url: url,
            headers: headers,
            data: form
        }

        const response = await axios(options)
        console.log(response.data)
        return response.data

    } catch (error) {
        console.log(error)

        return { success: false, error: error.message || 'Error desconocido en Luxand' };
    }
}

const searchAllPeopleInAPhoto = async (secure_url) => {

    try {

        const responseImg = await axios({
            method: 'get',
            url: secure_url,
            responseType: 'arraybuffer',
        })

        const imageBuffer = Buffer.from(responseImg.data)

        const url = "https://api.luxand.cloud/photo/search/all"
        const token = process.env.LUXAND_APIKEY
        const headers = {
            "token": token,
        }

        const form = new FormData()
        form.append("photo", imageBuffer, { filename: "photo.jpg" })

        headers['Content-Type'] = `multipart/form-data; boundary=${form.getBoundary()}`

        const options = {
            method: "POST",
            url: url,
            headers: headers,
            data: form
        }

        const response = await axios(options)
        return response.data

    } catch (error) {
        console.log(error)
        return {
            success: false,
            mensaje: 'error al buscar'
        }
    }

}

const fotografo_suscripcion = async (req, res) => {
    const { uid, plan_suscripcion_uid } = req.params
    const token = req.header('x-token')
    try {
        const unFotografo = await Fotografo.findByPk(uid)
        const unPlan = await Plan_suscripcion.findByPk(plan_suscripcion_uid)
        const { uid: uid_fotografo,
            fullname,
            correo_electronico,
            rol_user,
            evento_uid,
            direccion,
            especialidad
        } = unFotografo
        const { uid: uid_plan, nombre_plan, precio, periodicidad, descripcion } = unPlan
        if (unFotografo) {
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
                const { cancel_url, url, success_url } = pago

                let fechaActual = new Date()
                fechaActual.setMilliseconds(0)
                const fecha_inicio = formatearFecha(fechaActual)
                const fecha_fin = calcularFechaFin(fecha_inicio, periodicidad)

                const nuevaSuscripcion = await Suscripcion.create({
                    fecha_inicio,
                    fecha_fin,
                    fotografo_uid: uid,
                    plan_suscripcion_uid
                })

                if (correo_electronico == null) {
                    return res.json({
                        uid_fotografo,
                        fullname,
                        correo_electronico,
                        rol_user,
                        evento_uid,
                        direccion,
                        especialidad,
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
                const respuestaCorreo = await enviarCorreoSuscripcion(correo_electronico, contenidoSuscripcion)
                res.json({
                    uid_fotografo,
                    fullname,
                    correo_electronico,
                    rol_user,
                    evento_uid,
                    direccion,
                    especialidad,
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
            return res.status(404).json({ mensaje: 'no se encontro el fotografo' })
        }

    } catch (error) {
        console.log(error)
        res.status(404).json({ mensaje: 'erro al suscribir un fotografo' })
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

const fotografo_eliminar_fotografia_album = async (req, res) => {
    const { album_uid, fotografia_uid } = req.params
    try {
        const unAlbum = await Album.findByPk(album_uid)
        const unaFotografia = await Fotografia.findByPk(fotografia_uid)

        if (unAlbum) {
            if (unaFotografia) {
                const { precio: precio_fotografia } = unaFotografia
                const { precio: precio_album } = unAlbum

                unaFotografia.disponibilidad_album = false
                await unaFotografia.save()

                if ((precio_album) && (precio_fotografia)) {

                    if (precio_fotografia >= precio_album) {
                        unAlbum.precio = 0
                        await unAlbum.save()
                    } else {
                        const nuevo_precio = precio_album - precio_fotografia
                        if (nuevo_precio >= 0) {
                            unAlbum.precio = nuevo_precio
                            await unAlbum.save()
                        }
                    }



                }

                res.json({
                    mensaje: 'se elimino la fotografia',
                    unaFotografia
                })
            } else {
                res.status(404).json({
                    mensaje: 'la fotografia a eliminar no existe'
                })
            }
        } else {
            return res.status(404).json({
                mensaje: 'el album donde se encuentra la fotografia no existe '
            })
        }
    } catch (error) {
        console.log(error)

        res.status(404).json({
            mensaje: 'error al eliminar una fotografia de un album'
        })
    }

}

const perfil_fotografo = async (req, res) => {
    const { uid } = req.params
    try {
        const unFotografo = await Fotografo.findByPk(uid)
        const {
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
            evento_uid
        } = unFotografo
        res.json({
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
            evento_uid
        })
    } catch (error) {
        console.log(error)
        res.status(404).json({ mensaje: 'error al obtener el perfil del fotografo' })
    }
}
const generarQR = async (uuid_user, uuid_evento) => {

    try {

        const fotografo = await Fotografo.findByPk(uuid_user)
        const evento = await Evento.findByPk(uuid_evento)
        const { nombre_evento, descripcion } = evento
        const { correo_electronico } = fotografo
        if (!fotografo || !evento) {
            return {
                mensaje: 'Invitado o evento no encontrado',
                status: 404
            }
        }

        const datosQR = JSON.stringify(`http://sw1-segundo-parcial.s3-website.us-east-2.amazonaws.com/asistence`)

        const urlQRCode = await qr.toDataURL(datosQR)

        return { success: true, urlQRCode }

    } catch (error) {
        console.log(error)
        return {
            mensaje: 'error al generar un qr',
            status: 404
        }
    }

}

module.exports = {
    fotografoPost,
    fotografoGet,
    fotografoDelete,
    fotografoGetId,
    fotografoPut,
    crearUnAlbumAsignarEvento,
    actualizarAlbum,
    asignarFotografiaAlbum,
    getAlbum,
    ver_eventos_asignado,
    fotografo_ver_mis_fotografias,
    fotografo_eliminar_album,
    fotografo_suscripcion,
    fotografo_eliminar_fotografia_album,
    perfil_fotografo
}