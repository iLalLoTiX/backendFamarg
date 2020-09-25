/*
    Rutas /api/cajas
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();
const { 
    getProductos, 
    getProducto, 
    crearProducto, 
    actualizarProducto, 
    borrarProducto, 
    buscarProducto, 
    buscarProductoEstricto} = require ('../controllers/productosCtrl');

router.get( '/' ,[ ], getProductos);

router.get( '/:id' ,[ ], getProducto);

router.get( '/buscarProducto/:busqueda', buscarProducto);

router.post( '/buscarProductoEstricto', buscarProductoEstricto);

router.post( '/',
[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoria es obligatorio').not().isEmpty(),
    check('sku', 'La sku es obligatorio').not().isEmpty(),
    validarCampos,
],
crearProducto);

router.put( '/:id',
[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoria es obligatorio').not().isEmpty(),
    check('sku', 'La sku es obligatorio').not().isEmpty(),
    validarCampos,
],
actualizarProducto);

router.delete( '/:id', borrarProducto);

module.exports = router;