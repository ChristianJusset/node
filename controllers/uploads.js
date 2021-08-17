const fs = require('fs');

const { response } = require('express');

const { subirArchivo } = require('../helpers');
const path = require('path');
const { Usuario, Producto } = require('../models');


//cloudinary
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);


// muestra el tipado: res = response
const cargarArchivo = async (req, res = response) => {

    // muestra los datos del archivo enviado
    // postman: form-data
    try {
        // txt, md
        // const nombre = await subirArchivo( req.files, ['txt','md'], 'textos' );
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        res.json({ nombre });
        // para acceder a los archivos deben de estar en la carpeta publica
    } catch (msg) {
        res.status(400).json({ msg });
    }
}

const actualizarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params;

    // puede ser usuario o producto
    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }

            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }

            break;

        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' });
    }

    // Limpiar imágenes previas
    if (modelo.img) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    // se setea el campo img con el nuevo nombre generado
    modelo.img = nombre;
    // actulizar el campo del nombre con la nueva imagen
    await modelo.save();
    res.json(modelo);

}


const mostrarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params;
    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }

            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }

            break;

        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' });
    }


    // si el producto o usuario en el campo img, se busca por el nombre en la ruta local
    if (modelo.img) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen)
        }
    }

    // si no hay imagen por defaul mandar una no imagen
    const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathImagen);
}

// Cloudinary debido a que algunos hosting no guardan las imagenes
const actualizarImagenCloudinary = async (req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }

            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }

            break;

        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' });
    }

    // si tiene la imagen en la base de datos con la url que se encuentra en cloudinary

    if (modelo.img) {
        // separamos por /
        const nombreArr = modelo.img.split('/');
        // obtenemos la ultima parte
        const nombre = nombreArr[nombreArr.length - 1];
        // obtenemos el id
        const [public_id] = nombre.split('.');
        // borramos el archivo en cloudinary
        cloudinary.uploader.destroy(public_id);
    }


    const { tempFilePath } = req.files.archivo
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    modelo.img = secure_url;

    await modelo.save();


    res.json(modelo);
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}