const Organizador = require('../models/organizador.model')
const Invitado = require('../models/invitado.model')
const Fotografo = require('../models/fotografo.model')

const esEmailValido= async(correo_electronico='')=>{
    const existeEmailOrganizador = await Organizador.findOne({correo_electronico})
    const existeEmailInvitado = await Invitado.findOne({correo_electronico})
    const existeEmailFotogerafo = await Fotografo.findOne({correo_electronico})
    
    if(existeEmailOrganizador){
        throw new Error(`el siguiente email: ${correo_electronico} , ya esta registrado en la BD`)
    }
    if(existeEmailInvitado){
        throw new Error(`el siguiente email: ${correo_electronico} , ya esta registrado en la BD`)
    }
    if(existeEmailFotogerafo){
        throw new Error(`el siguiente email: ${correo_electronico} , ya esta registrado en la BD`)
    }
}

const existeUIdInvitado = async(uid)=>{
    const invitado = await Invitado.findByPk(uid)

    if(!invitado){
        throw new Error(`el siguiente ID: ${uid} no existe  en la BD`)
    }
}

const existeUIdFotografo = async(uid)=>{
    const fotografo = await Fotografo.findByPk(uid)
    console.log('fotogramiddleware: ', fotografo)
    if(!fotografo){
        throw new Error(`el siguiente ID: ${uid} no existe  en la BD`)
    }
}

const existeUIdOrganizador = async(uid)=>{
    const organizador = await Organizador.findByPk(uid)

    if(!organizador){
        throw new Error(`el siguiente ID: ${uid} no existe  en la BD`)
    }
}

module.exports={
    esEmailValido,
    existeUIdFotografo,
    existeUIdInvitado,
    existeUIdOrganizador
}