/*
    Rutas /api/usuarios
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();
const { getUsuario, crearUsuario, actualizarUsuario, borrarUsuario } = require ('../controllers/usuariosCtrl');

router.get( '/', validarJWT ,getUsuario);

router.post( '/',
[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos,
],
crearUsuario);

router.put( '/:id',
[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos,
],
actualizarUsuario);

router.delete( '/:id', borrarUsuario);

module.exports = router;