const { response } = require('express');
const { Categoria } = require('../models');

const obtenerCategorias = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        categorias
    });
}

//  res = response va para obetener las funciones del res
const obtenerCategoria = async(req, res = response ) => {

    const { id } = req.params;
    // populate va solo los campos que se necesitan
    // 'usuario', 'nombre' solo se muestra nombre
    const categoria = await Categoria.findById( id )
                            .populate('usuario', 'nombre');

    res.json( categoria );
}

const crearCategoria = async(req, res = response ) => {

    // se obtiene el nombre y se pasas como mayuscula
    const nombre = req.body.nombre.toUpperCase();

    // validad si ya se encuentra en la bd
    const categoriaDB = await Categoria.findOne({ nombre });

    if ( categoriaDB ) {
        // 400 badrquest la categoria ya se encuentra en la bd
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        });
    }


    // Generar la data a guardar
    const data = {
        nombre,
        // que usuario realiza la operacion
        // la informacion del usuario ya se encuentra en el usuario por el token
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data );
     
    // Guardar DB
     await categoria.save();

     // 201 es ok, 201 creado
     res.status(201).json(categoria);

}

const actualizarCategoria = async( req, res = response ) => {
    
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre  = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    res.json( categoria );

}

const borrarCategoria = async(req, res =response ) => {
    const { id } = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate( id, { estado: false }, {new: true });

    res.json( categoriaBorrada );
}
module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}