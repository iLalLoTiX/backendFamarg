const { response } = require('express');
var moment = require('moment');
var mongoose = require('mongoose')

const bcrypt = require('bcryptjs');

const EntradasProveedor = require('../models/entradaProveedorMdl');
const Contacto = require('../models/contactoMdl');
const Productos = require('../models/productoMdl');
const Orden = require('../models/ordenMdl');
const NoIdoneo = require('../models/noIdoneoMdl');

/*
    CRUD: GET, POST, PUT, DELETE
*/

const getEntrada = async (req, res) => {

    const idEntrada = req.params.id;

    const EntradaExiste = await EntradasProveedor.findById(idEntrada, '')
        .populate('proveedor', 'nombre')
        .populate('productos.producto', 'nombre');

    if (!EntradaExiste) {
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

const estadisticasEntradasProveedor = async (req, res) => {

    const fechaUno = req.query.fechaUno;
    const fechaDos = req.query.fechaDos;
    var m = moment(fechaDos, 'YYYY-M-DD, HH:mm:ss ZZ');
    m.set({ h: 17, m: 59 });

    const variable = new Array();
    variable.push(new Object());
    variable[0].$match = new Object();
    
    if (req.query.proveedor !== '') {
        variable[0].$match.proveedor = mongoose.Types.ObjectId(req.query.proveedor);
        
    }
    if (req.query.producto !== '') {
        
        variable[0].$match['productos.producto'] = mongoose.Types.ObjectId(req.query.producto);
        variable.push(new Object());
        variable[1].$project= new Object();
        variable[1].$project.fechaDeEntrada = 1; 
        variable[1].$project.productos = new Object();
        variable[1].$project.productos.$filter = new Object(); 
        variable[1].$project.productos.$filter = {
            input: '$productos',
            as: 'items',
            cond: { $eq: ['$$items.producto', mongoose.Types.ObjectId(req.query.producto)] }
        }
    }
    if (req.query.fechaUno !== '') {
        variable[0].$match.fechaDeEntrada = { $gte: new Date(fechaUno) }
    }

    if (req.query.fechaDos !== '') {
        variable[0].$match.fechaDeEntrada = { $lte: new Date(m) }
    }

    if (req.query.fechaDos !== '' && req.query.fechaUno !== '') {
        variable[0].$match.fechaDeEntrada = { $gte: new Date(fechaUno), $lte: new Date(m) }
    }

    console.log(variable);

    try 
    {
        const entradasProveedor = await EntradasProveedor.aggregate([variable]).sort({fechaDeEntrada: -1});

        let kg = 0;
        let merma = 0;
        let dinero = 0;
        for(let i = 0; i < entradasProveedor.length; i++)
        {
            for(let o = 0; o < entradasProveedor[i].productos.length; o++)
            {
                if(entradasProveedor[i].productos[o].totalMerma != undefined)
                {
                    kg      = kg + entradasProveedor[i].productos[o].cantidad;
                    merma   = merma + entradasProveedor[i].productos[o].totalMerma;
                    dinero  = dinero + entradasProveedor[i].productos[o].precio;
                }
            }
        }

        return  res.status(200).json({
            entradasProveedor: entradasProveedor,
            kg: kg - merma,
            merma: merma,
            total: kg,
            dinero: dinero,
            variable: variable
        });
            
    } catch (error) {
        console.log(error);
    }
}

const filtrarEntradasProveedor = async (req, res) => 
{

    const fechaUno = req.query.fechaUno;
    const fechaDos = req.query.fechaDos;

    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 25;
    var m = moment(fechaDos, 'YYYY-M-DD, HH:mm:ss ZZ');
    m.set({ h: 17, m: 59 });
    const variable = new Object();

    if (req.query.proveedor !== '') {
        variable.proveedor = req.query.proveedor
    }
    if (req.query.producto !== '') {
        variable['productos.producto'] = req.query.producto;
    }
    if (req.query.fechaUno !== '') {
        variable.fechaDeEntrada = { $gte: new Date(fechaUno) }
    }
    if (req.query.fechaDos !== '') {
        variable.fechaDeEntrada = { $lte: new Date(m) }
    }
    if (req.query.fechaDos !== '' && req.query.fechaUno !== '') {
        variable.fechaDeEntrada = { $gte: new Date(fechaUno), $lte: new Date(m) }
    }
    if (req.query.estado !== '') {
        if(req.query.estado == 'true'){
            variable.estado = true;
        }else{
            variable.estado = false;
        }
    }
     
    try {
        const entradasProveedor = await EntradasProveedor
        .find(variable)
        .populate('proveedor', 'nombre')
        .populate('productos.producto', 'nombre')
        .populate('productos.noIdoneo.destino', 'destino')
        .skip(desde).limit(limite).sort({ fechaEntrada: -1 });

        return res.status(200).json({
            entradasProveedor: entradasProveedor
        });
    }

    catch (error) {
        return res.status(400).json({
            error: error
        });
    }
};

const getEntradasProveedor = async (req, res) => {

    var m = moment().format('YYYY-M-DD 00:00:00');
    var m2 = moment().format('YYYY-M-DD 23:59:59');

    const entrada = await EntradasProveedor.find({ fechaDeEntrada: { $gte: new Date(m), $lte: m2 } })
        .populate('proveedor', 'nombre')
        .populate('productos.producto', 'nombre')
        .populate('productos.noIdoneo.destino', 'destino')
        .sort({ fechaEntrada: -1 });

    return res.json({
        entrada
    });
};


const crearEntradaProveedor = async (req, res = response) => {

    try {

        const { proveedor } = req.body;
        const proveedorExiste = await Contacto.findById(proveedor);

        if (!proveedorExiste) {
            return res.status(200).json({
                ok: false,
                msg: 'el proveedor no existe'
            });
        }

        for (let i = 0; i < req.body.productos.length; i++) {
            const productoDB = await Productos.findById(req.body.productos[i].producto);

            if (!productoDB) {
                return res.status(404).json({
                    ok: false,
                    msg: 'El producto en la pocicion ' + i + 'no existe',
                });
            }
        }

        req.body.fechaDeEntrada = new Date(req.body.fechaDeEntrada.replace(/-/g, '\/'));

        const entradaProveedor = new EntradasProveedor(req.body);
        await entradaProveedor.save();

        return res.json({
            ok: true,
            entradaProveedor
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'error inesperado',
        });
    }
};

const actualizarEntradaProveedor = async (req, res = response) => {

    const uid = req.params.id;
    try {
        const entradasProveedorDB = await EntradasProveedor.findById(uid);
        if (!entradasProveedorDB) {
            return res.status(400).json({
                ok: false,
                msg: 'La entrada de proveedor no existe',
            });
        }

        const actualizar = req.body;
        console.log(req.body);
        actualizar.fechaDeEntrada = new Date(actualizar.fechaDeEntrada.replace(/-/g, '\/'));
        actualizar.estado = false;
        const actualizarEntradaProveedor = await EntradasProveedor.findByIdAndUpdate(uid, actualizar, { new: true });

        return res.json({
            ok: true,
            actualizar: actualizarEntradaProveedor
        });

    } catch (err) {
        console.log(err);
        return res.status(404).json({
            ok: false,
            msg: 'Error al actualizar',
            error: err
        });
    }
};

const revisarEntradaProveedor = async (req, res = response) => {

    const uid = req.params.id;

    try {
        const entradasProveedorDB = await EntradasProveedor.findById(uid);
        if (!entradasProveedorDB) {
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

        const revisarEntradaProveedor = await EntradasProveedor.findByIdAndUpdate(uid, revisar, { new: true });

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

const borrarEntradaProveedor = async (req, res = response) => {

    const uid = req.params.id

    try {

        const entradasProveedorDB = await EntradasProveedor.findById(uid);

        if (!entradasProveedorDB) {
            return res.status(400).json({
                ok: false,
                msg: 'La entrada de proveedor no existe',
            });
        }

        await EntradasProveedor.findByIdAndDelete(uid);

        return res.status(200).json({
            ok: true,
            msg: 'Entrada borrada'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'error inesperado'
        });
    }
};

const mermar = async (req, res = response) => {

    const uid = req.params.id;

    try {
        const entradasProveedorDB = await EntradasProveedor.findById(uid);

        if (!entradasProveedorDB) {
            return res.status(400).json({
                ok: false,
                msg: 'La entrada de proveedor no existe',
            });
        }

        let cont = 0;

        entradasProveedorDB.productos[req.body.index].noIdoneo = new Array();

        if (req.body.mermas.length > 0) {
            for (let i = 0; i < req.body.mermas.length; i++) {
                const destino = await NoIdoneo.findOne({ destino: req.body.mermas[i].destino }, 'destino');
                entradasProveedorDB.productos[req.body.index].noIdoneo.push({ destino: destino._id, cantidad: req.body.mermas[i].cantidad });
                cont = req.body.mermas[i].cantidad + cont;
            }
        } else {

            entradasProveedorDB.productos[req.body.index].noIdoneo = new Array();

        }

        if (cont > entradasProveedorDB.productos[req.body.index].cantidad) {
            return res.status(400).json({
                ok: false,
                msg: 'la merma excede la cantidad ingresada'
            });
        }
        let estado = true;
        for (let i = 0; i < entradasProveedorDB.productos.length; i++) {
            if (entradasProveedorDB.productos[i].noIdoneo.length == 0) {
                estado = false;
            }
        }

        entradasProveedorDB.productos[req.body.index].totalMerma = cont;
        entradasProveedorDB.estado = estado;

        const mermas = await EntradasProveedor.findByIdAndUpdate(uid, entradasProveedorDB, { new: true });

        return res.status(200).json({
            ok: true,
            mermas
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'error inesperado',
            error
        });
    }
}

const borrarDesmarcar = async (req, res = response) => {

    const uid = req.params.id;

    try {
        const entradasProveedorDB = await EntradasProveedor.findById(uid);

        if (!entradasProveedorDB) {
            return res.status(400).json({
                ok: false,
                msg: 'La entrada de proveedor no existe',
            });
        }

        const borrarEntrada = await EntradasProveedor.findByIdAndRemove(uid);

        if (borrarEntrada.ordenCompra) {
            await Orden.findOneAndUpdate({ ordenCompra: borrarEntrada.ordenCompra }, { estado: 'pendiente' });
        }

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'error inesperado',
            error
        });
    }
}

module.exports = {
    borrarDesmarcar,
    mermar,
    filtrarEntradasProveedor,
    estadisticasEntradasProveedor,
    crearEntradaProveedor,
    revisarEntradaProveedor,
    actualizarEntradaProveedor,
    borrarEntradaProveedor,
    getEntradasProveedor,
    getEntrada
}