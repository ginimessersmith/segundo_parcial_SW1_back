const { DataTypes, Sequelize, Model } = require('sequelize')
const { sequelize } = require('../database/dbConnection')
const { v4: uuid } = require('uuid')


class Plan_suscripcion extends Model { }

Plan_suscripcion.init({
    uid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuid()
    },
    nombre_plan: {
        type: DataTypes.STRING,
        allowNull: false
    },
    precio: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    periodicidad: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    }
}, {
    sequelize,
    modelName: 'Plan_suscripcion',
    tableName: 'plan_suscripcions',
    timestamps: false
})



module.exports = Plan_suscripcion 