const { DataTypes, Sequelize,Model } = require('sequelize')
const { sequelize } = require('../database/dbConnection')
const { v4: uuid } = require('uuid')
const Fotografo = require('./fotografo.model')
const Organizador = require('./organizador.model')
const Plan_suscripcion = require('./plan_suscripcion.model')
const Invitado = require('./invitado.model')

class Suscripcion extends Model{}

Suscripcion.init({
    uid:{
        type:DataTypes.UUID,
        primaryKey:true,
        defaultValue:()=>uuid()
    },
    estado:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true
    },
    fecha_inicio:{
        type:DataTypes.DATEONLY,
        allowNull:false,
        defaultValue:Sequelize.fn('now')
    },
    fecha_fin:{
        type:DataTypes.DATEONLY,
        allowNull:false,
        defaultValue:Sequelize.fn('now')
    },
    fotografo_uid:{
        type:DataTypes.UUID,
        references:{
            model:Fotografo,
            key:'uid'
        }
    },
    plan_suscripcion_uid:{
        type:DataTypes.UUID,
        references:{
            model:Plan_suscripcion,
            key:'uid'
        }
    },
    invitado_uid:{
        type:DataTypes.UUID,
        references:{
            model:Invitado,
            key:'uid'
        }
    },
    organizador_uid:{
        type:DataTypes.UUID,
        references:{
            model:Organizador,
            key:'uid'
        }
    },
},{ sequelize,
    modelName: 'Suscripcion',
    tableName: 'suscripcions',
    timestamps:false})

    Suscripcion.belongsTo(Plan_suscripcion,{foreignKey:'plan_suscripcion_uid'})
    Suscripcion.belongsTo(Fotografo,{foreignKey:'fotografo_uid'})
    Suscripcion.belongsTo(Invitado,{foreignKey:'invitado_uid'})
    Suscripcion.belongsTo(Organizador,{foreignKey:'organizador_uid'})

module.exports=Suscripcion