const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerCategorias, crearCategoria, actualizarCategoria, borrarCategoria, obtenerCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');


const router = Router();

//  Obtener todas las categorias - publico
router.get('/', obtenerCategorias );

// Obtener una categoria por id - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos,
], obtenerCategoria );

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    // el campo nombre es obligatorio
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    // lanza todos los error que no cumplen con las validaciones
    validarCampos
], crearCategoria );

// Actualizar - privado - cualquiera con token válido
router.put('/:id',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeCategoriaPorId ),
    // tomar todas las validaciones
    validarCampos
],actualizarCategoria );


// Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    // tomar todas las validaciones
    validarCampos,
],borrarCategoria);


module.exports = router;
