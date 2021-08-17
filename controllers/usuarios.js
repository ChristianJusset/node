// npm install express
const { response, request } = require('express');

// npm i bcryptjs
const bcryptjs = require('bcryptjs');


const Usuario = require('../models/usuario');


const usuariosGet = async (req = request, res = response) => {

    //http://localhost:8090/api/usuarios?nombre=christian&apikey=sanchez&page=1&limit=10
    // const { nombre = 'No name', apikey, page = 1, limit } = req.query;

    // res.json({
    //     msg: 'get API - controlador',
    //     nombre,
    //     apikey,
    //     page,
    //     limit
    // });
    const { limite = 5, desde = 0 } = req.query;

    const query = { estado: true };
    // Promise.all: espera que se ejecuten abmas consultas
    // los await sirven para esperar a que se ejecuten uno tras otro y que uno dependan de otros
    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        usuarios
    });

}

const usuariosPost = async (req, res = response) => {
    // exception del nombre 
    //const { nombre, ... } = req.body;
    const { nombre, correo, password, rol } = req.body;

    // creamos una nueva instancia de usuario que ya tiene la configuracion de la bd
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // http://localhost:8090/api/usuarios
    // {
    //     "nombre":"christian",
    //     "edad" : 100
    // }

    // Guardar en BD
    await usuario.save();


    res.json({
        msg: 'post API - usuariosPost',
        usuario
    });
}

const usuariosPut = async (req, res = response) => {

    //http://localhost:8090/api/usuarios/10
    const { id } = req.params;
    // saca los campos _id, password, google, correo, de lo que venga de la base de datos
    const { _id, password, google, correo, ...resto } = req.body;
    
    if (password) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);
    res.json(usuario);
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const usuariosDelete = async (req, res = response) => {

    const { id } = req.params;
    // Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete( id );

    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );

    res.json({
        msg: 'delete API - usuariosDelete',
        usuario
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}