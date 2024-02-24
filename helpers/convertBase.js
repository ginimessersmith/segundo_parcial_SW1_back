const fs = require('fs')


const convert = async (base) => {
    // Tu cadena Base64
    const base64String = base // Inserta tu cadena Base64 aquí

    const outputFile = 'output.jpg' // Cambia el nombre y la extensión según tus necesidades

    const buffer = Buffer.from(base64String, 'base64')
    fs.writeFile(outputFile, buffer, (err) => {
        if (err) {
            console.error('Error al escribir el archivo:', err);
        } else {
            console.log('Archivo creado exitosamente:', outputFile);
        }
    })
    return buffer

}

module.exports = {
    convert
}

