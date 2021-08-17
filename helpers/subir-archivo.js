const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {

    return new Promise((resolve, reject) => {
        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
        // Validar la extension
        if (!extensionesValidas.includes(extension)) {
            return reject(`La extensión ${extension} no es permitida - ${extensionesValidas}`);
        }

        const nombreTemp = uuidv4() + '.' + extension;
        // ruta donde se va subir el archivo
        // __dirname: lllega hasta el controller
        // ../uploads: ingresa a la carpeta uploads
        // archivo.name: setea el nombre del archivo
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

        // mueve el archivo a la nueva ruta
        archivo.mv(uploadPath, (err)=> {
            if (err)
                return res.status(500).json({err});
    
            res.json({msg:"el archivo se subio"});
        });

    });
}

module.exports = {
    subirArchivo
}