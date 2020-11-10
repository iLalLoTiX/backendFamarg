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
    borrarDesmarcar,
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
    validarCampos,
], actualizarEntradaProveedor);

router.put( '/mermar/:id',
[], mermar);

router.put( '/revisar/:id',
[
    validarCampos,
], revisarEntradaProveedor);

router.delete( '/borrarDesmarcarEntrada/:id',
[
    validarCampos,
], borrarDesmarcar);

router.delete( '/borrarEntrada/:id' , borrarEntradaProveedor);

module.exports = router;