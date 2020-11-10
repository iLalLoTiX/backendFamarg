/*
    Rutas /api/cargar
*/
const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

const { crearOrdenes, getOrdenes, editar, registrar, eliminar, getOrden, desmarcar} = require ('../controllers/ordenesCtrl');

router.post( '/',
[
],  crearOrdenes);

router.get('/',
[], getOrdenes);

router.get('/:id',
[], getOrden);

router.put('/editar/:id',
[], editar);

router.put('/registrar/:id',
[], registrar);

router.put('/desmarcar/:id',
[], desmarcar);

router.delete('/:id',
[], eliminar);

module.exports = router;