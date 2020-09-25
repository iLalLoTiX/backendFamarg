/*
    Rutas /api/cajas
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();
const { getCajas, crearCajas, actualizarCajas, borrarCajas } = require ('../controllers/cajasCtrl');

router.get( '/' ,[ ], getCajas);

router.post( '/',
[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('precio', 'El precio es obligatorio').not().isEmpty(),
    check('peso', 'El peso es obligatorio').not().isEmpty(),
    validarCampos,
],
crearCajas);

router.put( '/:id',
[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('precio', 'El precio es obligatorio').not().isEmpty(),
    check('peso', 'El peso es obligatorio').not().isEmpty(),
    validarCampos,
],
actualizarCajas);

router.delete( '/:id', borrarCajas);

module.exports = router;