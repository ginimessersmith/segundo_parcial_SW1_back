const { DataTypes, Model, Sequelize } = require('sequelize')
const { sequelize } = require('../database/dbConnection')
const { v4: uuid } = require('uuid')
const  Organizador  = require('./organizador.model')
// const {album}=require('./album.model')
// const {fotografo}=require('./fotografo.model')
// const {invitado}=require('./invitado.model')

class Evento extends Model{}

Evento.init({
    uid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuid()
    },
    nombre_evento: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue:Sequelize.fn('now')

    },
    hora: {
        type: DataTypes.TIME,
        allowNull: false,
        defaultValue:Sequelize.fn('now')

    },
    puntaje: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue:0
    },
    lugar: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ubicacion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    esta_activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    organizador_uid: {
        type: DataTypes.UUID,
        references:{
            model:Organizador,
            key:'uid'
        }
    },
    
}, {sequelize,
    modelName: 'Evento',
    tableName: 'eventos',
    timestamps: false })

Evento.belongsTo(Organizador,{foreignKey:'organizador_uid'})


module.exports =  Evento 