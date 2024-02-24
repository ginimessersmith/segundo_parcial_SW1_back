const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USERNAME, 
    process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres'
    // ,dialectOptions:{
    //     ssl: {
    //         require: true,
    //     },
    // }
})

module.exports={sequelize}
