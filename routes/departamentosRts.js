/*
    Rutas /api/departamentos
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();
const { getDepartamento, getDepartamentos, crearDepartamento, actualizarDepartamento, borrarDepartamento } = require ('../controllers/departamentosCrtl');

router.get( '/' ,[ ], getDepartamentos);

router.get( '/:id' ,[ ], getDepartamento);

router.post( '/',
[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('puestos', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
],
crearDepartamento);

router.put( '/:id',
[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('puestos', 'El puesto es obligatorio').not().isEmpty(),
    validarCampos,
],
actualizarDepartamento);

router.delete( '/:id', borrarDepartamento);

module.exports = router;