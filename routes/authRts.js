/*
    PATH: 'api/login'
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers/authCtrl');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/', 
    [
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos
    ],
    login
);

module.exports = router;