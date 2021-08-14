const { response, request } = require('express');


const usuariosGet = (req = request, res = response) => {

    //http://localhost:8090/api/usuarios?nombre=christian&apikey=sanchez&page=1&limit=10
    const { nombre = 'No name', apikey, page=1, limit} = req.query;

    res.json({
        msg: 'get API - controlador',
        nombre,
        apikey,
        page,
        limit
    });
}

const usuariosPost = (req, res = response) => {
    const { nombre, edad } = req.body;

    // http://localhost:8090/api/usuarios
    // {
    //     "nombre":"christian",
    //     "edad" : 100
    // }

    res.json({
        msg: 'post API - usuariosPost',
        nombre, 
        edad
    });
}

const usuariosPut = (req, res = response) => {

    //http://localhost:8090/api/usuarios/10
    const { id } = req.params;

    res.json({
        msg: 'put API - usuariosPut',
        id
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const usuariosDelete = (req, res = response) => {
    res.json({
        msg: 'delete API - usuariosDelete'
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}