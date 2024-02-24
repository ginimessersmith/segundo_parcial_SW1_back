const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../database/dbConnection')
const { v4: uuid } = require('uuid')
const Evento = require('./evento.model')
const Fotografia = require('./fotografia.model')
const InvitadoFotografia = require('./invitado_fotografias.model')



class Invitado extends Model { }

Invitado.init({
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
        allowNull: false
    },
    password_user: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rol_user: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'invitado'
    },
    nro_telefono: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    direccion: {
        type: DataTypes.STRING,
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
    evento_uid: {
        type: DataTypes.UUID,
        references: {
            model: Evento,
            key: 'uid'
        }
    },
    luxand_uuid: {
        type: DataTypes.UUID,
        allowNull:true,
    },
    disponibilidad_evento: {
        type: DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true
    }
}, {
    sequelize,
    modelName: 'Invitado',
    tableName: 'invitados',
    timestamps: false
})

Invitado.belongsTo(Evento, { foreignKey: 'evento_uid' })


module.exports = Invitado