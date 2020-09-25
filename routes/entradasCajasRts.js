/*
    Rutas /api/cargar
*/
const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

const { getEntradasCajas, filtrarFechas, crearEntradaCajas, actualizarEntradaCajas, borrarEntradaCajas } = require ('../controllers/entradasCajasCtrl');

router.get( '/', getEntradasCajas);

router.get( '/:fechaUno/:fechaDos', filtrarFechas);

router.post( '/',
[
    check('chofer', 'El  es obligatorio').not().isEmpty(),
    check('copiloto', 'El copiloto es obligatorio').not().isEmpty(),
    check('cajas', 'Las Cajas son obligatorios').not().isEmpty(),
    validarCampos,
],crearEntradaCajas);

router.put( '/:id',
[
    check('chofer', 'El chofer es obligatorio').not().isEmpty(),
    check('copiloto', 'El copiloto es obligatorio').not().isEmpty(),
    check('cajas', 'Las Cajas son obligatorios').not().isEmpty(),
    validarCampos,
],actualizarEntradaCajas);

router.delete('/:id', borrarEntradaCajas)

module.exports = router;