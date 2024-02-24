const { DataTypes, Model,Sequelize } = require('sequelize')
const { sequelize } = require('../database/dbConnection')
const { v4: uuid } = require('uuid')
const Evento = require('./evento.model')
const Fotografo = require('./fotografo.model')
const Fotografia = require('./fotografia.model')


class Album extends Model {}

Album.init({
    uid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuid()
    },
    nombre_album: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: true
    },
    evento_uid: {
        type: DataTypes.UUID,
        references: {
            model: Evento,
            key: 'uid'
        }
    },
    fotografo_uid: {
        type: DataTypes.UUID,
        references: {
            model: Fotografo,
            key: 'uid'
        }

    },
    fotografia_uid: {
        type: DataTypes.UUID,
        references: {
            model: Fotografia,
            key: 'uid'
        }
    },
    disponibilidad: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:true
    },
    precio: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue:0
    }

}, {sequelize,
    modelName:'Album',
    tableName:'albums', 
    timestamps: false })

//Album.hasMany(Fotografia, { foreignKey: 'album_uid' });
//Fotografia.belongsTo(Album, { foreignKey: 'album_uid' })
Album.belongsTo(Evento,{foreignKey:'evento_uid'})
Album.belongsTo(Fotografo,{foreignKey:'fotografo_uid'})


module.exports = Album 
