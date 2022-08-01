//rutas de usuario / auth
//host + /api/auth
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth')
const { validarjwt } = require('../middlewares/validar-jwt')

const router = Router();

router.post(
    '/', 
    [
        check('email', 'El email es obligatorio o esta mal escrito').isEmail(),
        check('password', 'El password debe ser de 6 caracteres o mas').isLength({ min: 6 }),
        validarCampos        
    ],
    loginUsuario );

router.post(
    '/new', 
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio o esta mal escrito').isEmail(),
        check('password', 'El password debe ser de 6 caracteres o mas').isLength({ min: 6 }),
        validarCampos
    ],
    crearUsuario );


 router.get('/renew',validarjwt, revalidarToken );


module.exports = router;