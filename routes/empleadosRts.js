/*
    Rutas /api/empleados
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();
const {buscarEmpleadosPuesto, buscarEmpleados, totalEmpleados, getEmpleado, getEmpleados, crearEmpleado, actualizarEmpleado, borrarEmpleado } = require ('../controllers/empleadosCtrl');


router.get( '/total' ,[ ], totalEmpleados);

router.get( '/busqueda/:busqueda' ,[ ], buscarEmpleados);

router.get( '/puesto/:busqueda' ,[ ], buscarEmpleadosPuesto);

router.get( '/empleado/:id' ,[ ], getEmpleado);

router.get( '/' ,[ ], getEmpleados);

router.post( '/',
[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('idInterno', 'El ID interno es obligatorio').not().isEmpty(),
    check('telefono', 'El telefono es obligatorio').not().isEmpty(),
    check('sexo', 'El sexo es obligatorio').not().isEmpty(),
    check('departamento', 'El departamento ID es obligatorio').isMongoId(),
    check('puesto', 'El puesto es obligatorio').not().isEmpty(),
    validarCampos,
],
crearEmpleado);

router.put( '/:id',
[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('idInterno', 'El ID interno es obligatorio').not().isEmpty(),
    check('telefono', 'El telefono es obligatorio').not().isEmpty(),
    check('sexo', 'El sexo es obligatorio').not().isEmpty(),
    check('departamento', 'El departamento ID es obligatorio').isMongoId(),
    check('puesto', 'El puesto es obligatorio').not().isEmpty(),
    validarCampos,
],
actualizarEmpleado);

router.delete( '/:id', borrarEmpleado);

module.exports = router;