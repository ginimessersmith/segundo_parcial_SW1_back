const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../database/dbConnection')
const { v4: uuid } = require('uuid')
// const {suscripcion} = require('./suscripcion.model')
//const {Evento} = require('./evento.model')

class Organizador extends Model{}

Organizador.init({
    uid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuid()
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    correo_electronico: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'correo_electronico'
    },
    password_user: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rol_user: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'organizador'
    },
    nro_telefono: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    foto_perfil_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    estado_suscripcion: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    es_activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {sequelize,
    modelName: 'Organizador',
    tableName: 'organizadors',
    timestamps: false })



module.exports =  Organizador 