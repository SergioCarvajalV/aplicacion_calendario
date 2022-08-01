//rutas de usuario / events
//host + /api/events
const { Router } = require('express');
const { check } =require ('express-validator');
const { validarCampos } = require('../middlewares/validar-campos')
const { validarjwt } = require('../middlewares/validar-jwt')
const { isDate } = require('../helpers/isDate');
const { getEvento, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const router = Router(); 
//todo del router pasara por el validarJWT
router.use(validarjwt);

// obtener eventos
router.get('/' ,getEvento);
//crear evento
router.post(
    '/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio erronea').custom(isDate),
        check('end', 'Fecha de finalizacion errona').custom(isDate),
        validarCampos
    ],
     crearEvento,
     );
//Actualizar evento
router.put('/:id', actualizarEvento);
//Borrar evento
router.delete('/:id', eliminarEvento);


module.exports = router;