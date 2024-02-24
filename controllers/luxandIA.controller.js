const axios = require('axios')
const FormData = require('form-data');
const luxandIAPost = async (req, res) => {
}
const listPersonsinDatabase = async (req, res) => {
    const token=process.env.LUXAND_APIKEY
    const url ='https://api.luxand.cloud/v2/person'

    const headers={
        "token": token,
        "Content-'Type'": "multipart/form-data"
    }

    const form = new FormData();
    headers['Content-Type'] = `multipart/form-data; boundary=${form.getBoundary()}`;

    const options = {
        method:'GET',
        url,
        headers,
        data:form
    }

    try {
        const response = await axios(options)

        res.json(response.data)
        
    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje:'hubo un error'
        })
    }
}



module.exports = {
   
    listPersonsinDatabase,
    
}