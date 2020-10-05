/*
    Rutas /api/empleados
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

const { 
    getContacto, 
    getContactos, 
    crearContacto, 
    actualizarContacto, 
    borrarContacto, 
    buscarContacto, 
    buscarContactoEstricto ,
    } = require ('../controllers/contactosCtrl');


router.get( '/' ,[ ], getContactos);

router.get( '/:id' ,[ ], getContacto);

router.get( '/buscarContacto/:busqueda', buscarContacto);

router.post( '/buscarContactoEstricto', buscarContactoEstricto);

router.post( '/',
[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
],
crearContacto);

router.put( '/:id',
[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('telefono', 'El telefono es obligatorio').not().isEmpty(),
    validarCampos,
],
actualizarContacto);

router.delete( '/:id', borrarContacto);

module.exports = router;