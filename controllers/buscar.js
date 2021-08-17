const { response } = require('express');
const { ObjectId } = require('mongoose').Types;


const { Usuario, Categoria, Producto } = require('../models');



// lista de coleccion en la base de datos
const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async (termino = '', res = response) => {

    // cuando no se ingresa nombre, solo el id dentro de la bd
    const esMongoID = ObjectId.isValid(termino); // TRUE 

    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            // muestra lista de los resultados
            // se manda result porque en la otra validacion puede retornar mas de un valor
            results: (usuario) ? [usuario] : []
        });
    }



    // valida si la expresion regular tiene almenos palabras de la busqueda
    // i: insentive a las mayuscula
    const regex = new RegExp(termino, 'i');
    const usuarios = await Usuario.find({
        // buscar por nombre o correo
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    })

    res.json({
        results: usuarios
    });



}



const buscarCategorias = async (termino = '', res = response) => {
    // cuando no se ingresa nombre, solo el id dentro de la bd
    const esMongoID = ObjectId.isValid(termino); // TRUE 

    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({ nombre: regex, estado: true });

    res.json({
        results: categorias
    });
}


const buscarProductos = async (termino = '', res = response) => {
    // cuando no se ingresa nombre, solo el id dentro de la bd
    const esMongoID = ObjectId.isValid(termino); // TRUE 

    if (esMongoID) {
        const producto = await Producto.findById(termino)
            .populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        });
    }

    // muestra datos con el join de categoria y nombre : .populate('categoria','nombre')
    const regex = new RegExp(termino, 'i');

    // s0lo buscar por nombre y estado activo
    const productos = await Producto.find({ nombre: regex, estado: true })
        .populate('categoria', 'nombre')

    res.json({
        results: productos
    });

}

const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;

        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta búsquda'
            })
    }

}

module.exports = {
    buscar
}