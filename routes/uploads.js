const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validarCampos, validarArchivoSubir } = require('../middlewares');

const router = Router();

router.post('/', [validarArchivoSubir], cargarArchivo);


router.put('/:coleccion/:id', [
    // las validaciones de middleware son mas generales
    validarArchivoSubir,
    check('id', 'El id debe de ser de mongo').isMongoId(),
    // ['usuarios','productos']: colecciones permitidas
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], actualizarImagen)
// actualizarImagenCloudinary

router.get('/:coleccion/:id', [
    check('id', 'El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen)

module.exports = router;