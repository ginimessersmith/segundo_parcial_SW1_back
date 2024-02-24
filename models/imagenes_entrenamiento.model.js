const {DataTypes,Model}= require('sequelize')
const { sequelize } = require('../database/dbConnection')
const {v4:uuid} = require('uuid')
const Invitado = require('./invitado.model')
class Imagenes_entrenamiento extends Model{}

Imagenes_entrenamiento.init({
    uid:{
        type:DataTypes.UUID,
        primaryKey:true,
        defaultValue:()=>uuid()
    },
    img_url:{
        type:DataTypes.STRING,
        allowNull:false
    },
    invitado_uid:{
        type:DataTypes.UUID,
        references:{
            model:Invitado,
            key:'uid'
        }
    }
},{sequelize,
    modelName:'Imagenes_entrenamiento',
    tableName:'imagenes_entrenamientos',
    timestamps:false})

    Imagenes_entrenamiento.belongsTo(Invitado,{foreignKey:'invitado_uid'})
    
module.exports=Imagenes_entrenamiento