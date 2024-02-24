const { DataTypes, Model, Sequelize } = require('sequelize')
const { sequelize } = require('../database/dbConnection')
const { v4: uuid } = require('uuid')
const Fotografo = require('./fotografo.model')
const Invitado = require('./invitado.model')
const InvitadoFotografia = require('./invitado_fotografias.model')
const Album = require('./album.model')


class Fotografia extends Model { }

Fotografia.init({
    uid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuid()
    },
    img_url: {
        type: DataTypes.STRING,
        allowNull: false

    },
    fecha_creacion: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.fn('now')
    },
    visibilidad: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    fotografo_uid: {
        type: DataTypes.UUID,
        references: {
            model: Fotografo,
            key: 'uid'
        }
    },
    album_uid: {
        type: DataTypes.UUID,
        references: {
            model: Album,
            key: 'uid'
        }
    },
    criterio_calidad: {
        type: DataTypes.STRING,
        allowNull:true
    },
    precio: {
        type: DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0
    },
    disponibilidad_album: {
        type: DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true
    },
    opcion_organizador_publica: {
        type: DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true
    },
    opcion_organizador_fotos_solo_por_evento: {
        type: DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true
    },
    opcion_organizador_solo_quienes_aparecen_evento: {
        type: DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true
    },
    esta_pagada: {
        type: DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false
    },

}, {
    sequelize,
    modelName: 'Fotografia',
    tableName: 'fotografias',
    timestamps: false
})


Fotografia.belongsTo(Fotografo, { foreignKey: 'fotografo_uid' })
Fotografia.belongsTo(Album, { foreignKey: 'album_uid' })


module.exports = Fotografia 