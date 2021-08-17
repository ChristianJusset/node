
const { response } = require('express');
const path = require('path');

const { v4: uuidv4 } = require('uuid');


// muestra el tipado: res = response
const cargarArchivo = async (req, res = response) => {

    // muestra los datos del archivo enviado
    // postman: form-data

    // valida si trae archivos
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            msg:"No hay archivos"
        });
    }

    // valida si trae data exactamente en archivo
    if (!req.files.archivo ) {
        return res.status(400).json({
            msg:"No hay archivos"
        });
    }

    // obtiene el archivo
    const {archivo} = req.files;

    // solo extensiones png, jpg, jpeg, gif
    const extensionesValidas = ['png','jpg','jpeg','gif']
    // dividimos con el separados .
    const nombreCortado = archivo.name.split('.');
    // obtenermos la ultima parte
    const extension = nombreCortado[ nombreCortado.length - 1 ];

    // validar las extensiones
    if ( !extensionesValidas.includes( extension ) ) {
        return res.status(400).json({
            msg:"no es el tipo"
        })
    }

    const nombreTemp = uuidv4() + '.' + extension;




 
    
    const uploadPath = path.join( __dirname, '../uploads/', nombreTemp );

    
    archivo.mv(uploadPath, (err)=> {
        if (err)
            return res.status(500).json({err});

        res.json({msg:"el archivo se subio"});
    });
}

module.exports = {
    cargarArchivo
}