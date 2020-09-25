var moment = require('moment');
const EntradasProveedor = require('../models/entradaProveedorMdl');
const Contacto = require('../models/contactoMdl');

const { response } = require('express');

const buscarNombre = async(req, res) => {

    const proveedor = req.body.proveedor;

    const desde = Number(req.query.desde) || 0 ;
    const limite = Number(req.query.limite) || 5 ;
    const entradasProveedor = await EntradasProveedor.find({proveedor: proveedor}, 
        'kg fechaEntrada revisado bueno malo')
        .populate('proveedor', 'nombre')
        .populate('producto', 'nombre')
        .skip(desde)
        .limit(limite).sort({fechaEntrada:-1});
    return res.status(400).json({
        entradasProveedor
    });
}

const buscarProducto = async(req, res) => {

    const producto = req.body.producto;

    const desde = Number(req.query.desde) || 0 ;
    const limite = Number(req.query.limite) || 5 ;

    const entradasProveedor = await EntradasProveedor.find({producto: producto}, 
        'kg fechaEntrada revisado bueno malo')
        .populate('proveedor', 'nombre')
        .populate('producto', 'nombre')
        .skip(desde)
        .limit(limite).sort({fechaEntrada:-1});

    return res.status(400).json({
        entradasProveedor
    });
}

module.exports = {buscarNombre, buscarProducto}