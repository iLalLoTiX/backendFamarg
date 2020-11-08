/*
    Rutas /api/cargar
*/
const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

const { 
    crearEntradaProveedor,
    actualizarEntradaProveedor, 
    filtrarEntradasProveedor, 
    borrarEntradaProveedor, 
    getEntradasProveedorTrue, 
    getEntradasProveedorFalse, 
    getEntradasProveedor, 
    getEntrada,
    revisarEntradaProveedor,
    mermar} = require ('../controllers/entradaProveedorCtrl');

router.get( '/', getEntradasProveedor);

router.get( '/buscarEntrada/:id', getEntrada);

router.get( '/filtrarFechas', filtrarEntradasProveedor);

router.get( '/entradasProveedorTrue', getEntradasProveedorTrue);

router.get( '/entradasProveedorFalse', getEntradasProveedorFalse);

router.post( '/',
[
    check('proveedor', 'El proveedor es obligatorio').not().isEmpty(),
    validarCampos,
], crearEntradaProveedor);

router.put( '/editar/:id',
[
    check('proveedor', 'El proveedor es obligatorio').not().isEmpty(),
    check('producto', 'El producto es obligatorio').not().isEmpty(),
    check('kg', 'Los Kilos son obligatorios').not().isEmpty(),
    validarCampos,
], actualizarEntradaProveedor);

router.put( '/mermar/:id',
[], mermar);

router.put( '/revisar/:id',
[
    check('malo', 'Introduce la cantidad perdida de producto').not().isEmpty(),
    validarCampos,
], revisarEntradaProveedor);

router.delete('/:id', borrarEntradaProveedor);

module.exports = router;