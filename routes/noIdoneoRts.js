/*
    Rutas /api/noIdoneo
*/
const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

const { buscarDestino, crearDestino, actualizarDestino, getDestino, buscarDestinoEstricto } = require ('../controllers/noIdoneoCtrl');

router.post( '/',
[
],  crearDestino);

router.put( '/:id',
[
],  actualizarDestino);

router.get( '/',
[
],  getDestino);

router.get( '/buscarDestinos/:destino',
[
],  buscarDestino);

router.get( '/buscarDestino/:destino',
[
],  buscarDestinoEstricto);

module.exports = router;