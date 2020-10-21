const { response } = require('express');
var moment = require('moment');

const bcrypt = require('bcryptjs');

const EntradasProveedor = require('../models/entradaProveedorMdl');
const Contacto = require('../models/contactoMdl');

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

    const fechaUno = req.query.fechaUno;
    const fechaDos = req.query.fechaDos;

    const desde = Number(req.query.desde) || 0 ; 
    const limite = Number(req.query.limite) || 5 ;
    var m = moment(fechaDos, 'YYYY-M-DD, HH:mm:ss ZZ');
    m.set({h: 23, m: 59});

    const variable = new Object();
    
    if(req.query.proveedor !== ''){
         variable.proveedor = req.query.proveedor
    }
    if(req.query.producto !== ''){
        variable.producto= req.query.producto
    }
    if(req.query.fechaUno !== ''){
        variable.fechaEntrada=  {$gte: new Date(fechaUno)} 
    }
    if(req.query.fechaDos !== ''){
        variable.fechaEntrada=  {$lte: m} 
    }
    if(req.query.fechaDos !== '' && req.query.fechaUno !== ''){
        variable.fechaEntrada=  {$gte: new Date(fechaUno), $lte: m} 
    }

    try {
        const entradasProveedor = await EntradasProveedor.find(variable, 
        'kg fechaEntrada revisado bueno malo')
        .populate('proveedor', 'nombre')
        .populate('producto', 'nombre')
        .skip(desde)
        .limit(limite).sort({fechaEntrada:-1});

        const mermas = await EntradasProveedor.find(variable, 
        'kg revisado malo')
        .sort({fechaEntrada:-1});

        var malo = 0;
        var kgTotal = 0;
        mermas.forEach( a => {
            if(a.revisado == true){
                malo = a.malo + malo;
                kgTotal = a.kg + kgTotal;
            }
        });

        return  res.json({
            entradasProveedor: entradasProveedor,
            malo: malo,
            kgTotal: kgTotal,
        });
    }

    catch (error) {
        return  res.status(400).json({
            error: error
        });
    }    
};

const getEntradasProveedor = async (req, res) =>{

    const desde = Number(req.query.desde) || 0 ; 
    const limite = Number(req.query.limite) || 5 ;
    
    var m = moment().format('YYYY-M-DD 00:00:00');
    var m2 = moment().format('YYYY-M-DD 23:59:59');
    
    const entradasProveedor = await EntradasProveedor.find({fechaEntrada: {$gte: m, $lte: m2}}, 'kg fechaEntrada proveedor producto revisado')
    .populate('proveedor', 'nombre')
    .populate('producto', 'nombre')
    .sort({fechaEntrada:-1});

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

const desrevisarEntradaProveedor = async (req, res = response) =>{

    const uid = req.params.id;

    try {
        const entradasProveedorDB = await EntradasProveedor.findById(uid);
        if(!entradasProveedorDB){
            return res.status(400).json({
                ok: false,
                msg: 'La entrada de proveedor no existe',
            });
        }

        var revisar = new Object();
        revisar.bueno = 0; 
        revisar.malo = 0;
        revisar.fechaRevicion = new Date();
        revisar.revisado = false;
        console.log(revisar);

        const desrevisarEntradaProveedor = await EntradasProveedor.findByIdAndUpdate(uid, revisar, {new: true});
        
        return res.json({
            ok: true,
            revisado: desrevisarEntradaProveedor
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
    desrevisarEntradaProveedor,
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