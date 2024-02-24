const express = require('express')
const cors = require('cors')
const paths = require('../path/path')
const fileUpload = require('express-fileupload')
const { sequelize } = require('../database/dbConnection')

class Server {
    constructor() {
        this.app = express()
        this.port = 8082
        this.dbConnection()
        this.middleware()
        this.routes()


    }

    async dbConnection() {
        try {
            await sequelize.authenticate()
            // await sequelize.sync({force:true})
            console.log('conexion con la base de datos realizada con exito')
        } catch (error) {
            console.log('error con la conexion a la base de datos')
        }
    }

    middleware() {
        this.app.use(cors())
        this.app.use(express.json())
        this.app.use(express.static('public'))
        this.app.use(fileUpload({
            useTempFiles:true,
            tempFileDir:'/tmp/',
            createParentPath:true
        }))
    }

    listen() {
        this.app.listen(this.port,()=>{
            console.log(`server corriendo en el puerto: ${this.port}`)
        })
    }

    routes() {
         this.app.use(paths.invitado,require('../routes/invitado.routes'))
        //  this.app.use(paths.metadatos_img,require('../routes/metadatos_img.routes'))
        this.app.use(paths.fotografo,require('../routes/fotografo.routes'))
        this.app.use(paths.organizador,require('../routes/organizador.routes'))
        this.app.use(paths.album,require('../routes/album.routes'))
        this.app.use(paths.evento,require('../routes/evento.routes'))
        this.app.use(paths.fotografia,require('../routes/fotografia.routes'))
        this.app.use(paths.plan_suscripcion,require('../routes/plan_suscripcion.routes'))
        this.app.use(paths.suscripcion,require('../routes/suscripcion.routes'))
        this.app.use(paths.imagenes_entrenamiento,require('../routes/imagenes_entrenamiento.routes'))
        this.app.use(paths.qr,require('../routes/qr.routes'))
        this.app.use(paths.invitado_fotografia,require('../routes/invitado_fotografia.routes'))
        this.app.use(paths.auth,require('../routes/auth.routes'))
        this.app.use(paths.luxandIA,require('../routes/luxandIA.routes'))
    }


}

module.exports = Server