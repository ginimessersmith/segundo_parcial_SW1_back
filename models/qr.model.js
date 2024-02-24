const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../database/dbConnection')
const { v4: uuid } = require('uuid')
const Invitado = require('./invitado.model')
const Fotografo = require('./fotografo.model')



class Qr extends Model { }

Qr.init({
    uid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuid()
    },
    habilitado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    invitado_uid: {
        type: DataTypes.UUID,
        references: {
            model: Invitado,
            key: 'uid'
        }
    },
    fotografo_uid: {
        type: DataTypes.UUID,
        references: {
            model: Fotografo,
            key: 'uid'
        }
    }
}, {
    sequelize,
    modelName: 'Qr',
    tableName: 'qrs',
    timestamps: false
})

Qr.belongsTo(Invitado,{foreignKey:'invitado_uid'})
Qr.belongsTo(Fotografo,{foreignKey:'fotografo_uid'})

module.exports = Qr
