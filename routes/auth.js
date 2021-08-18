const { Router } = require('express');
const { check } = require('express-validator');


const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// controller login
const { login, googleSignin, renovarToken } = require('../controllers/auth');

const router = Router();


router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login );

router.post('/google',[
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validarCampos
], googleSignin );

// valida si el token es correcto: validarJWT
// renueva nueva version del token :renovarToken
// validarJWT: trae el los datos del usuario en el request y lo utilizamos en "renovarToken"
router.get('/', validarJWT, renovarToken );


module.exports = router;