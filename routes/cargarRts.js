/*
    Rutas /api/cargar
*/
const { Router } = require('express');
const fileUpload = require('express-fileupload');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

const { cargarImagen, mostrarImagen } = require ('../controllers/cargarCtrl');

router.use(fileUpload());

router.post( '/:tipo/:id', cargarImagen);

router.put( '/:tipo/:id', cargarImagen);

router.get( '/:tipo/:foto', mostrarImagen);

module.exports = router;