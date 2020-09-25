const { response } = require('express');
var moment = require('moment');

const bcrypt = require('bcryptjs');

const EntradasProveedor = require('../models/entradaProveedorMdl');

/*
    CRUD: GET, POST, PUT, DELETE
*/

const getEntrada = async (req, res) => {
    
    const idEntrada = req.params.id;

    const EntradaExiste = await EntradasProveedor.findById(idEntrada);

    if(!EntradaExiste){
        return res.status(400).json({
            ok: true,
            msg: 'La entrada de proveedor no existe'
        });
    }

    return res.status(200).json({
        ok: true,
        EntradaExiste
    });

}

const filtrarEntradasProveedor = async (req, res) =>{
    //body
    const fechaUno = req.body.fechaUno;
    const fechaDos = req.body.fechaDos;

    const proveedor = req.body.proveedor;
    const producto = req.body.producto;

    const desde = Number(req.query.desde) || 0 ; 
    const limite = Number(req.query.limite) || 5 ; 

    const regexProv = new RegExp(proveedor, 'i');
    const regexProd = new RegExp(producto, 'i');
    

    var m = moment(fechaDos, 'YYYY-M-DD, HH:mm:ss ZZ');
    m.set({h: 23, m: 59});

    try {
        var entradasProveedor;
        if(fechaUno === '' || fechaDos === '')
        {
            entradasProveedor = await EntradasProveedor.find({proveedor: proveedor, producto: producto}, 
            'kg fechaEntrada revisado bueno malo')
            .populate('proveedor', 'nombre')
            .populate('producto', 'nombre')
            .skip(desde)
            .limit(limite).sort({fechaEntrada:-1});
        }else{
            entradasProveedor = await EntradasProveedor.find({fechaEntrada: {$gte: new Date(fechaUno), $lte: m.toDate()}, proveedor: regexProv, producto: regexProd}, 
            'kg fechaEntrada proveedor producto revisado bueno malo')
            .skip(desde)
            .limit(limite).sort({fechaEntrada:-1});
        }
        
        const total = await EntradasProveedor.countDocuments();
        var bueno = 0;
        var malo = 0;
        entradasProveedor.forEach( a => {
            if(a.bueno !== undefined){
                bueno = a.bueno + bueno;
            }
            if(a.malo !== undefined){
                malo = a.malo + malo;
            }
        });

        return  res.json({
            entradasProveedor: entradasProveedor,
            bueno: bueno,
            malo: malo,
            total
        });

    } catch (error) {
        return  res.status(400).json({
            error: error
        });
    }    
};

const porcentajeMerma = async (req, res) =>{
    //body
    const fechaUno = req.query.fechaUno;
    const fechaDos = req.query.fechaDos;

    const proveedor = req.query.proveedor;
    const producto = req.query.producto;

    const regexProv = new RegExp(proveedor, 'i');
    const regexProd = new RegExp(producto, 'i');
    var m = moment(fechaDos, 'YYYY-M-DD, HH:mm:ss ZZ');
    m.set({h: 23, m: 59});
    try {
        var entradasProveedor;
        if(fechaUno === '' || fechaDos === '')
        {
            entradasProveedor = await EntradasProveedor.find({proveedor: regexProv, producto: regexProd}, 
            'kg fechaEntrada proveedor producto revisado bueno malo');
        }else{
            entradasProveedor = await EntradasProveedor.find({fechaEntrada: {$gte: new Date(fechaUno), $lte: m.toDate()}, proveedor: regexProv, producto: regexProd}, 
            'kg fechaEntrada proveedor producto revisado bueno malo');
        }
        
        var malo = 0;
        var kgTotal = 0;
        entradasProveedor.forEach( a => {
            if(a.malo !== undefined){
                malo = a.malo + malo;
            }
            if(a.kg !== undefined){
                kgTotal = a.kg + kgTotal;
            }
        });

        return  res.json({
            malo: malo,
            kgTotal: kgTotal,
        });

    } catch (error) {
        return  res.status(400).json({
            error: error
        });
    }    
};

const getEntradasProveedor = async (req, res) =>{

    const desde = Number(req.query.desde) || 0 ; 
    const limite = Number(req.query.limite) || 5 ; 

    const entradasProveedor = await EntradasProveedor.find({}, 'kg fechaEntrada proveedor producto revisado').
    skip(desde).
    limit(limite).sort({fechaEntrada:-1});

    return  res.json({
        entradasProveedor
    });
};

const getEntradasProveedorFalse = async (req, res) =>{

    const entradasProveedor = await EntradasProveedor.find({revisado: false}, 'kg fechaEntrada proveedor producto revisado').limit(20);

    return  res.json({
        entradasProveedor
    });
};

const getEntradasProveedorTrue = async (req, res) =>{

    const entradasProveedor = await EntradasProveedor.find({revisado: true}, 'kg fechaEntrada proveedor producto revisado').limit(20);

    return  res.json({
        entradasProveedor
    });
};

const crearEntradaProveedor = async (req, res = response) =>{

    try {
        const entradaProveedor = new EntradasProveedor(req.body);
        entradaProveedor.fechaEntrada = new Date();
        await entradaProveedor.save();

        return  res.json({
            ok: true,
            entradaProveedor
        });
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'error inesperado',
            body: req.body
        });
    }
};

const actualizarEntradaProveedor = async (req, res = response) =>{

    const uid = req.params.id;

    try {
        const entradasProveedorDB = await EntradasProveedor.findById(uid);
        if(!entradasProveedorDB){
            return res.status(400).json({
                ok: false,
                msg: 'La entrada de proveedor no existe',
            });
        }

        const actualizar = req.body;
        actualizar.fechaEntrada = entradasProveedorDB.fechaEntrada;
        const actualizarEntradaProveedor = await EntradasProveedor.findByIdAndUpdate(uid, actualizar, {new: true});
        
        return res.json({
            ok: true,
            actualizar: actualizarEntradaProveedor
        });
        
    } catch (error) {
        return res.status(404).json({
            ok: false,
            msg: 'Error al actualizar',
            req
        });
    }
};

const revisarEntradaProveedor = async (req, res = response) =>{

    const uid = req.params.id;

    try {
        const entradasProveedorDB = await EntradasProveedor.findById(uid);
        if(!entradasProveedorDB){
            return res.status(400).json({
                ok: false,
                msg: 'La entrada de proveedor no existe',
            });
        }

        const revisar = req.body;
        revisar.bueno = entradasProveedorDB.kg - revisar.malo; 
        revisar.fechaEntrada = entradasProveedorDB.fechaEntrada;
        revisar.fechaRevicion = new Date();
        revisar.revisado = true;

        const revisarEntradaProveedor = await EntradasProveedor.findByIdAndUpdate(uid, revisar, {new: true});
        
        return res.json({
            ok: true,
            revisado: revisarEntradaProveedor
        });
        
    } catch (error) {
        return res.status(404).json({
            ok: false,
            msg: 'Error al actualizar',
            req
        });
    }
};

const borrarEntradaProveedor = async (req, res = response) =>{

    const uid = req.params.id

    try 
    {

        const entradasProveedorDB = await EntradasProveedor.findById(uid);

        if(!entradasProveedorDB){
            return res.status(400).json({
                ok: false,
                msg: 'La entrada de cajas no existe',
            });
        }

        await EntradasProveedor.findByIdAndDelete(uid);
        
        return res.status(200).json({
            ok: true,
            msg: 'Entrada borrada'
        });

    } catch (error) 
    {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperado'
        });
    }
};

module.exports = {
    porcentajeMerma,
    filtrarEntradasProveedor,
    crearEntradaProveedor,
    revisarEntradaProveedor,
    actualizarEntradaProveedor,
    borrarEntradaProveedor,
    getEntradasProveedorTrue,
    getEntradasProveedorFalse,
    getEntradasProveedor,
    getEntrada
}

