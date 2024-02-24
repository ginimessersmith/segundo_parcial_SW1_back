const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../database/dbConnection')
const { v4: uuid } = require('uuid')
const Evento = require('./evento.model')


class Fotografo extends Model { }

Fotografo.init({
    uid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuid()

    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    correo_electronico: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    password_user: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    rol_user: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'fotografo'

    },
    nro_telefono: {
        type: DataTypes.INTEGER,
        allowNull: true,

    },
    tipo_fotografo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    foto_perfil_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    especialidad: {
        type: DataTypes.STRING,
        allowNull: true,

    },
    estado_suscripcion: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true

    },
    entidad: {
        type: DataTypes.STRING,
        allowNull: true,

    },
    permitido_en_evento: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true

    },
    evento_uid:{
        type:DataTypes.UUID,
        references:{
            model:Evento,
            key:'uid'
        }
    }
}, { sequelize,
    modelName:'Fotografo',
    tableName:'fotografos',
    timestamps: false })

Fotografo.belongsTo(Evento,{
    foreignKey:'evento_uid'
})

module.exports = Fotografo
