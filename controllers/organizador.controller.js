const bcrypt = require('bcryptjs')
const qr = require('qrcode')
const Organizador = require('../models/organizador.model')
const Evento = require('../models/evento.model')
const { generarJWT } = require('../helpers/generar-jwt')
const Fotografo = require('../models/fotografo.model')
const stripe = require('stripe')(process.env.STRIPE_KEY)
const nodemailer = require('nodemailer')
const Suscripcion = require("../models/suscripcion.model")
const Plan_suscripcion = require("../models/plan_suscripcion.model")
const Invitado = require('../models/invitado.model')
const { where } = require('sequelize')
const Fotografia = require('../models/fotografia.model')
const Invitado_fotografia = require('../models/invitado_fotografias.model')
const Album = require('../models/album.model')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_GOOGLE,
        pass: process.env.PASS_GOOGLE,
    },
})

const organizadorPost = async (req, res) => {
    const {
        fullname,
        correo_electronico,
        password_user,
        confirmPassword,
    } = req.body

    try {

        if (password_user == confirmPassword) {

            const salt = bcrypt.genSaltSync()
            const encryptPassword = bcrypt.hashSync(password_user, salt)
            // console.log(fullname,correoElectronico,passwordUser)
            const nuevoOrganizador = await Organizador.create({
                fullname,
                correo_electronico,
                password_user: encryptPassword
            })

            const token = await generarJWT(nuevoOrganizador.uid)

            console.log('organizador creado con exito')
            res.json({
                nuevoOrganizador,
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
            mensaje: 'erro al crear un organizador'
        })
    }
}

const organizadorCrearEvento = async (req, res) => {
    const { organizador_uid } = req.params
    const { nombre_evento,
        descripcion,
        fecha,
        hora,
        puntaje,
        lugar,
        ubicacion,

    } = req.body

    try {

        if (!puntaje || puntaje == '') {
            const nuevoEvento = await Evento.create({
                nombre_evento,
                descripcion,
                fecha,
                hora,
                lugar,
                ubicacion,
                organizador_uid


            })
            return res.json({ nuevoEvento })
        }

        const nuevoEvento = await Evento.create({
            nombre_evento,
            descripcion,
            fecha,
            hora,
            puntaje,
            lugar,
            ubicacion,
            organizador_uid

        })
        res.json({ nuevoEvento })

    } catch (error) {
        console.log(error)
        res.status(404).json({
            mensaje: 'ERROR: no se pudo crear un evento en el controlador del organizador'
        })
    }
}

const organizador_actualizar_evento = async (req, res) => {
    const { organizador_uid, evento_uid } = req.params
    const { nombre_evento,
        descripcion,
        fecha,
        hora,
        puntaje,
        lugar,
        ubicacion,
        esta_activo

    } = req.body

    try {

        const eventoActualizar = await Evento.findByPk(evento_uid)
        if (eventoActualizar) {

            if (nombre_evento && nombre_evento != '') {
                eventoActualizar.nombre_evento = nombre_evento
            }

            if (descripcion && descripcion != '') {
                eventoActualizar.descripcion = descripcion
            }

            if (fecha && fecha != '') {
                eventoActualizar.fecha = fecha
            }

            if (puntaje !== undefined) {
                eventoActualizar.puntaje = puntaje
            }

            if (hora && hora != '') {
                eventoActualizar.hora = hora
            }

            if (lugar && lugar != '') {
                eventoActualizar.lugar = lugar
            }

            if (ubicacion && ubicacion != '') {
                eventoActualizar.ubicacion = ubicacion
            }

            if (esta_activo !== undefined) {
                eventoActualizar.esta_activo = esta_activo
            }

            await eventoActualizar.save()
            res.json({ eventoActualizar })
        } else {
            return res.json({ mensaje: 'no se encontro el evento a actualizar' })
        }



    } catch (error) {
        console.log(error)
        res.status(404).json({ mensaje: 'error al actualizar un evento desde el controlador' })
    }

}

const organizador_agregar_fotografo_evento = async (req, res) => {
    const { fotografo_uid, evento_uid } = req.params

    try {
        const unFotografo = await Fotografo.findByPk(fotografo_uid)
        const unEvento = await Evento.findByPk(evento_uid)


        if (unFotografo) {
            if (unEvento) {
                const { esta_activo } = unEvento
                if (esta_activo) {
                    const{correo_electronico}=unFotografo
                    const { bufferQR } = await generarQRBuffer(fotografo_uid, evento_uid)
                    const correoSend = await enviarCorreoCredencial(correo_electronico, unFotografo, unEvento, bufferQR)
                    unFotografo.evento_uid = evento_uid
                    await unFotografo.save()

                    return res.json({
                        FotografoAgregado: unFotografo,
                        EventoAsignado: unEvento,
                        correoSend
                    })
                } else {
                    return res.status(404).json({
                        mensaje: 'el evento fue cancelado'
                    })
                }


            } else {

                return res.status(404).json({
                    mensaje: 'no se encontro el evento para la asignacion del evento'
                })
            }

        } else {
            return res.status(404).json({
                mensaje: 'no se encontro el fotografo para la asignacion del evento'
            })
        }


    } catch (error) {
        console.log(error)
        res.json({ mensaje: 'error al agregar un fotografo a un evento desde el controlador de un organizador' })
    }
}

const organizador_agregar_invitado_evento = async (req, res) => {
    const { invitado_uid, evento_uid } = req.params

    try {
        const unInvitado = await Invitado.findByPk(invitado_uid)
        const unEvento = await Evento.findByPk(evento_uid)


        if (unInvitado) {
            if (unEvento) {

                const { uid: uid_invitado, correo_electronico, fullname, rol_user,
                    nro_telefono, direccion, evento_uid: evento_id, estado_suscripcion } = unInvitado

                const { bufferQR } = await generarQRBufferI(invitado_uid, evento_uid)
                const correoSend = await enviarCorreoInvitacion(correo_electronico, unInvitado, unEvento, bufferQR)
                unInvitado.evento_uid = evento_uid


                await unInvitado.save()

                const InvitadoAsignado = {
                    uid_invitado, correo_electronico, fullname, rol_user,
                    nro_telefono, direccion, evento_uid: evento_id, estado_suscripcion,
                    correoSend
                }

                return res.json({
                    InvitadoAsignado,
                    EventoAsignado: unEvento,
                    //  qrCode
                })

            } else {

                return res.status(404).json({
                    mensaje: 'no se encontro el evento para la asignacion del evento'
                })
            }

        } else {
            return res.status(404).json({
                mensaje: 'no se encontro el invitado para la asignacion del evento'
            })
        }


    } catch (error) {
        console.log(error)
        res.json({ mensaje: 'error al agregar un fotografo a un evento desde el controlador de un organizador' })
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

        const datosQR = JSON.stringify({

            nombre_evento,
            descripcion,
            fotografo: {
                uid: fotografo.uid,
                fullname: fotografo.fullname,
                correo_electronico: fotografo.correo_electronico
            },
            evento: {
                uid: evento.uid,
                nombre_evento: evento.nombre_evento,
                descripcion: evento.descripcion
            },
        })

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

const organizador_todos_eventos = async (req, res) => {
    const { uid } = req.params
    try {
        const todosEventos = await Evento.findAll({ where: { organizador_uid: uid, esta_activo: true } })
        let todosEventosConFotografos = []
        for (let evento of todosEventos) {
            const fotografos = await Fotografo.findAll({
                where: { evento_uid: evento.uid }
            })

            todosEventosConFotografos.push({
                evento,
                fotografos
            })
        }
        res.json(todosEventosConFotografos)
    } catch (error) {
        console.log(error)
        res.status(404).json({ mensaje: 'error al obtener la lista de los eventos' })
    }

}

const organizador_suscripcion = async (req, res) => {
    const { uid, plan_suscripcion_uid } = req.params
    const token = req.header('x-token')
    try {
        const unOrganizador = await Organizador.findByPk(uid)
        const unPlan = await Plan_suscripcion.findByPk(plan_suscripcion_uid)
        const { uid: uid_organizador,
            fullname,
            correo_electronico,
            rol_user,
            evento_uid,
            direccion,
            especialidad
        } = unOrganizador
        const { uid: uid_plan, nombre_plan, precio, periodicidad, descripcion } = unPlan
        if (unOrganizador) {
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
                    organizador_uid: uid,
                    plan_suscripcion_uid
                })

                if (correo_electronico == null) {
                    return res.json({
                        uid_organizador,
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
                    uid_organizador,
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
            return res.status(404).json({ mensaje: 'no se encontro el organizador' })
        }

    } catch (error) {
        console.log(error)
        res.status(404).json({ mensaje: 'erro al suscribir un organizador' })
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


const organizador_quienes_asisteron_evento = async (req, res) => {
    const { evento_uid } = req.params
    try {

        const unEvento = await Evento.findByPk(evento_uid)
        const { esta_activo } = unEvento
        if (esta_activo) {
            const listaInvitados = await Invitado.findAll({
                attributes: ['fullname', 'correo_electronico', 'nro_telefono', 'rol_user'],
                where: { evento_uid }
            })
            const listaFotografos = await Fotografo.findAll({
                attributes: ['fullname', 'correo_electronico', 'nro_telefono', 'tipo_fotografo', 'direccion', 'especialidad', 'entidad', 'rol_user'],
                where: { evento_uid }
            })

            const filtrarListaInvitados = listaInvitados.map(invitado => {
                return {
                    fullname: invitado.fullname,
                    correo_electronico: invitado.correo_electronico || 'No tiene',
                    nro_telefono: invitado.nro_telefono || 'No tiene',
                    rol_user: invitado.rol_user || 'No tiene'
                }
            })

            const filtrarListaFotografos = listaFotografos.map(fotografo => {
                return {
                    fullname: fotografo.fullname,
                    correo_electronico: fotografo.correo_electronico || 'No tiene',
                    nro_telefono: fotografo.nro_telefono || 'No',
                    tipo_fotografo: fotografo.tipo_fotografo || 'No tiene',
                    direccion: fotografo.direccion || 'No tiene',
                    especialidad: fotografo.especialidad || 'No tiene',
                    entidad: fotografo.entidad || 'No tiene',
                    rol_user: fotografo.rol_user || 'No tiene'
                }
            })
            return res.json({ listaInvitados: filtrarListaInvitados, listaFotografos: filtrarListaFotografos })
        } else {
            res.status(404).json({
                mensaje: 'el evento fue cancelado'
            })
        }


    } catch (error) {
        console.log(error)
        res.status(404).json({
            mensaje: 'Erro al obtener la lista de invitados  y fotografos'
        })
    }
}

const organizador_cancelar_evento = async (req, res) => {
    const { evento_uid } = req.params

    try {
        const unEvento = await Evento.findByPk(evento_uid)

        if (unEvento) {
            const listaInvitadosEnEvento = await Invitado.findAll({ where: { evento_uid } })
            const listaFotografosEnEvento = await Fotografo.findAll({ where: { evento_uid } })

            for (let invitado of listaInvitadosEnEvento) {
                invitado.disponibilidad_evento = false
                await invitado.save()
            }

            for (let fotografos of listaFotografosEnEvento) {
                fotografos.permitido_en_evento = false
                await fotografos.save()
            }

            unEvento.esta_activo = false
            await unEvento.save()
            res.json(listaFotografosEnEvento)

        } else {
            return res.status(404).json({
                mensaje: 'no se encontro el evento'
            })
        }

    } catch (error) {
        console.log(error)
        res.status(404).json({
            mensaje: 'Error al cancelar evento'
        })
    }

}


const organizador_permitir_las_fotos_son_publicas = async (req, res) => {
    try {
        const { uid, evento_uid } = req.params
        const listaFotografias = await Fotografia.findAll()
        const listaInvitadoFotos = await Invitado_fotografia.findAll()
        const unEvento = await Evento.findOne({ where: { uid: evento_uid } })
        if (unEvento) {
            const { organizador_uid } = unEvento
            if (organizador_uid == uid) {

                const listaAlbum = await Album.findAll({ where: { evento_uid } })
                const resultadoAlbumFotos = []
                for (let album of listaAlbum) {
                    const { uid: uid_album } = album
                    const listaFotografias = await Fotografia.findAll({ where: { album_uid: uid_album } })

                    resultadoAlbumFotos.push(listaFotografias)
                }

                const resultFotos = resultadoAlbumFotos.flat()

                for (let unaFoto of resultFotos) {

                    const { uid: uid_fot } = unaFoto
                    const lista_invitado_foto = await Invitado_fotografia.findAll({ where: { fotografia_uid: uid_fot } })
                    for (let invitado_foto of lista_invitado_foto) {
                        invitado_foto.op_organizador_publica = true
                        invitado_foto.op_organizador_vean_invitado_evento = false
                        invitado_foto.op_organizador_vean_invitado_fotografia = false
                        await invitado_foto.save()
                    }

                    unaFoto.opcion_organizador_publica = true
                    unaFoto.opcion_organizador_fotos_solo_por_evento = false
                    unaFoto.opcion_organizador_solo_quienes_aparecen_evento = false
                    await unaFoto.save()
                }
                res.json(resultFotos)

            } else {
                return res.status(404).json({ mensaje: 'usted no puede editar este evento' })
            }

        } else {
            return res.status(404).json({ mensaje: 'el evento no fue encontrado' })
        }


    } catch (error) {
        console.log(error)
        res.status(404).json({ mensaje: 'Error al poner publicas todas las fotos' })
    }
}

const organizador_permitir_las_fotos_solo_por_evento = async (req, res) => {
    try {

        const { uid, evento_uid } = req.params
        const listaFotografias = await Fotografia.findAll()
        const listaInvitadoFotos = await Invitado_fotografia.findAll()
        const unEvento = await Evento.findOne({ where: { uid: evento_uid } })
        if (unEvento) {
            const { organizador_uid } = unEvento
            if (organizador_uid == uid) {

                const listaAlbum = await Album.findAll({ where: { evento_uid } })
                const resultadoAlbumFotos = []
                for (let album of listaAlbum) {
                    const { uid: uid_album } = album
                    const listaFotografias = await Fotografia.findAll({ where: { album_uid: uid_album } })

                    resultadoAlbumFotos.push(listaFotografias)
                }

                const resultFotos = resultadoAlbumFotos.flat()

                for (let unaFoto of resultFotos) {

                    const { uid: uid_fot } = unaFoto
                    const lista_invitado_foto = await Invitado_fotografia.findAll({ where: { fotografia_uid: uid_fot } })

                    for (let invitado_foto of lista_invitado_foto) {
                        invitado_foto.op_organizador_publica = false
                        invitado_foto.op_organizador_vean_invitado_evento = true
                        invitado_foto.op_organizador_vean_invitado_fotografia = false
                        await invitado_foto.save()
                    }

                    unaFoto.opcion_organizador_publica = false
                    unaFoto.opcion_organizador_fotos_solo_por_evento = true
                    unaFoto.opcion_organizador_solo_quienes_aparecen_evento = false
                    await unaFoto.save()
                }
                res.json(resultFotos)

            } else {
                return res.status(404).json({ mensaje: 'usted no puede editar este evento' })
            }

        } else {
            return res.status(404).json({ mensaje: 'el evento no fue encontrado' })
        }

    } catch (error) {
        console.log(error)
        res.status(404).json({ mensaje: 'Error al poner publicas todas las fotos' })
    }
}

const organizador_permitir_las_fotos_solo_quienes_aparecen_evento = async (req, res) => {
    try {
        const { uid, evento_uid } = req.params
        const listaFotografias = await Fotografia.findAll()
        const listaInvitadoFotos = await Invitado_fotografia.findAll()
        const unEvento = await Evento.findOne({ where: { uid: evento_uid } })
        if (unEvento) {
            const { organizador_uid } = unEvento
            if (organizador_uid == uid) {

                const listaAlbum = await Album.findAll({ where: { evento_uid } })
                const resultadoAlbumFotos = []
                for (let album of listaAlbum) {
                    const { uid: uid_album } = album
                    const listaFotografias = await Fotografia.findAll({ where: { album_uid: uid_album } })

                    resultadoAlbumFotos.push(listaFotografias)
                }

                const resultFotos = resultadoAlbumFotos.flat()

                for (let unaFoto of resultFotos) {
                    const { uid: uid_fot } = unaFoto
                    const lista_invitado_foto = await Invitado_fotografia.findAll({ where: { fotografia_uid: uid_fot } })
                    for (let invitado_foto of lista_invitado_foto) {
                        invitado_foto.op_organizador_publica = false
                        invitado_foto.op_organizador_vean_invitado_evento = false
                        invitado_foto.op_organizador_vean_invitado_fotografia = true
                        await invitado_foto.save()
                    }

                    unaFoto.opcion_organizador_publica = false
                    unaFoto.opcion_organizador_fotos_solo_por_evento = false
                    unaFoto.opcion_organizador_solo_quienes_aparecen_evento = true

                    //invitado_foto

                    await unaFoto.save()
                }
                res.json(resultFotos)

            } else {
                return res.status(404).json({ mensaje: 'usted no puede editar este evento' })
            }

        } else {
            return res.status(404).json({ mensaje: 'el evento no fue encontrado' })
        }
    } catch (error) {
        console.log(error)
        res.status(404).json({ mensaje: 'Error al poner publicas todas las fotos' })
    }
}
const perfil_organizador = async (req, res) => {
    const { uid } = req.params
    try {
        const unOrganizador = await Organizador.findByPk(uid)
        const {
            fullname,
            correo_electronico,
            rol_user,
            nro_telefono,
            foto_perfil_url,
            estado_suscripcion,
            es_activo } = unOrganizador
        res.json({
            uid,
            fullname,
            correo_electronico,
            rol_user,
            nro_telefono,
            foto_perfil_url,
            estado_suscripcion,
            es_activo
        })

    } catch (error) {
        console.log(error)
        res.status(404).json({ mensaje: 'error al obtener el perfil del organizador' })
    }
}
const organizadorGet = async (req, res) => {
    try {
        const todosLosOrganizadores = await Organizador.findAll({ attributes: { exclude: ['password_user'] } })
        res.json(todosLosOrganizadores)
    } catch (error) {
        console.log(error)
        res.status(404).json({ mensaje: 'error al obtener todos los organizadores' })
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

const enviarCorreoInvitacion = async (destinatario, unInvitado, unEvento, buffer) => {
    try {
        const { nombre_evento, descripcion } = unEvento
        const { fullname } = unInvitado
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

const enviarCorreoCredencial = async (destinatario, unInvitado, unEvento, buffer) => {
    try {
        const { nombre_evento, descripcion } = unEvento
        const { fullname } = unInvitado
        const contenidoHTML = `
            <html>
                <body>
                    <p>Hola ${fullname}, usted fue Seleccionado al evento:</p>
                    <p>${nombre_evento}</p>
                    <p>Descripción: ${descripcion}</p>
                    <p>Su credencial es la siguiente: </p>
                    <p>Código QR</p>

                    <img src="cid:codigoQR" alt="Código QR">
                    
                </body>
            </html>
        `

        const asunto = `Seleccionado a un Evento`
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

const generarQRBuffer = async (uuid_user, uuid_evento) => {

    try {

        const fotografo = await Fotografo.findByPk(uuid_user)
        const evento = await Evento.findByPk(uuid_evento)
        const { nombre_evento, descripcion } = evento
        const { fullname, correo_electronico } = fotografo
        if (!fotografo || !evento) {
            return {
                mensaje: 'fotografo o evento no encontrado',
                status: 404
            }
        }
        // const mensaje =`Nombre : ${fullname} , evento: ${nombre_evento}`
        const mensaje = `http://sw1-segundo-parcial.s3-website.us-east-2.amazonaws.com/asistence`
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

const generarQRBufferI = async (uuid_user, uuid_evento) => {

    try {

        const invitado = await Invitado.findByPk(uuid_user)
        const evento = await Evento.findByPk(uuid_evento)
        
        if (!invitado || !evento) {
            return {
                mensaje: 'fotografo o evento no encontrado',
                status: 404
            }
        }
        // const mensaje =`Nombre : ${fullname} , evento: ${nombre_evento}`
        const mensaje = `http://sw1-segundo-parcial.s3-website.us-east-2.amazonaws.com/asistence`
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

const organizadorGetId = async (req, res) => { }
const organizadorPut = async (req, res) => { }
const organizadorDelete = async (req, res) => { }


module.exports = {
    organizadorPost,
    organizadorGet,
    organizadorDelete,
    organizadorGetId,
    organizadorPut,
    organizadorCrearEvento,
    organizador_actualizar_evento,
    organizador_agregar_fotografo_evento,
    organizador_todos_eventos,
    organizador_suscripcion,
    organizador_quienes_asisteron_evento,
    organizador_cancelar_evento,
    organizador_permitir_las_fotos_son_publicas,
    organizador_permitir_las_fotos_solo_por_evento,
    organizador_permitir_las_fotos_solo_quienes_aparecen_evento,
    organizador_agregar_invitado_evento,
    perfil_organizador

}