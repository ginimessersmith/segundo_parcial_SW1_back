const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../database/dbConnection')
const Invitado = require('./invitado.model')
const Fotografia = require('./fotografia.model')

class Invitado_fotografia extends Model { }

Invitado_fotografia.init({

  invitado_uid: {
    type: DataTypes.UUID,
    primaryKey: true
  },
  fotografia_uid: {
    type: DataTypes.UUID,
    primaryKey: true
  },
  visible: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  op_organizador_publica: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  op_organizador_vean_invitado_evento: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  op_organizador_vean_invitado_fotografia: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }

}, {
  sequelize,
  modelName: 'Invitado_fotografia',
  tableName: 'invitado_fotografias',
  timestamps: false,
  primaryKey: ['invitado_uid', 'fotografia_uid']
})


//Invitado_fotografia.belongsTo(Invitado, { foreignKey: 'invitado_uid' })
//Invitado_fotografia.belongsTo(Fotografia, { foreignKey: 'fotografia_uid' })

module.exports = Invitado_fotografia