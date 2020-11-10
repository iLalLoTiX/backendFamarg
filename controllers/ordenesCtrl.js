const { response } = require('express');
var moment = require('moment');
const bcrypt = require('bcryptjs');
const {contar} = require('../helpers/contarOrden');

const Producto = require('../models/productoMdl');
const Orden    = require('../models/ordenMdl');
const EntradasProveedor = require('../models/entradaProveedorMdl');

const getOrdenes = async (req, res = response) => {
    
    var m = moment().format('YYYY-M-DD');

    await Orden.deleteMany({fechaDeEntrada: {$lt: m}});
    
    const orden = await Orden.find({})
    .populate('proveedor', 'nombre')
    .populate('productos.producto', 'nombre').sort({fechaDeEntrada: 1});
    
    const cantidad = await Orden.find({})
    .populate('proveedor', 'nombre')
    .populate('productos.producto', 'nombre').countDocuments();

    var productos = new Array();
    var fechas = new Array();

    if(cantidad <= 0){
        return  res.status(400).json({
            ok: false,
            msg: 'no hay ordenes de compra',
        });
    }

    productos.push({id:orden[0].productos[0].producto._id, nombre: orden[0].productos[0].producto.nombre});
    
    for(let x = 0; x <cantidad; x++)
    {
        for(let y = 0; y < orden[x].productos.length; y++)
        {    
            for(let z = 0; z < productos.length; z++)
            {
                if(productos.findIndex(i => i.id === orden[x].productos[y].producto._id) == -1){
                    productos.push({id: orden[x].productos[y].producto._id, nombre: orden[x].productos[y].producto.nombre});
                }
            }
        }
    }

    let arrayFechas = orden.map((i) => new Date(i.fechaDeEntrada));

    var fechaFin = new Date(Math.max.apply(null,arrayFechas));
    
    // local
    var desde = moment(m);
    var hasta = moment(fechaFin);

    var diasEntreFechas = function(desde, hasta) {
        var dia_actual = desde;
        var fechas = [];

        while (dia_actual.isSameOrBefore(hasta)) {
            fechas.push(dia_actual.format('YYYY-MM-DD'));
            dia_actual.add(1, 'days');
        }
        return fechas;
    };

    fechas = diasEntreFechas(desde, hasta);

    return  res.status(200).json({
        ok: true,
        fechas,
        productos,
        orden,
    });
}

const crearOrdenes = async (req, res = response) => {
    
    for(let i = 0; i <req.body.productos.length; i++)
    {
        
        req.body.ordenCompra = await contar();
        
        const productoDB = await Producto.findById(req.body.productos[i].producto);

        if(!productoDB){
            return res.status(404).json({
                ok: false,
                msg: 'El producto en la pocicion ' + i + 'no existe' ,
            });
        }
    }
    
    req.body.fechaDeEntrada = new Date(req.body.fechaDeEntrada.replace(/-/g, '\/'));

    const orden = new Orden(req.body);

    await orden.save();
    return  res.json({
        ok: true,
        orden
    });
}

const editar = async (req, res = response) => {

    const uid = req.params.id;

    const ordenExiste = await Orden.findById(uid);

    if(!ordenExiste){
        return res.status(400).json({
            ok: false,
            msg: 'la orden no existe'
        });
    }

    req.body.fechaDeEntrada = new Date(req.body.fechaDeEntrada.replace(/-/g, '\/'));

    const actualizarOrden = await Orden.findByIdAndUpdate(uid, req.body, {new: true});

    return res.status(200).json({
        ok: true,
        actualizarOrden
    });

}

const eliminar = async (req, res = response) => {
    const uid = req.params.id;

    const ordenExiste = await Orden.findById(uid);

    if(!ordenExiste){
        return res.status(400).json({
            ok: false,
            msg: 'la orden no existe'
        });
    }

    await Orden.findByIdAndRemove(uid);

    return res.status(200).json({
        ok: true,
        msg: 'Orden eliminada exitosamente'
    });
}

const registrar = async (req, res = response) => {

    
    const uid = req.params.id;

    const ordenExiste = await Orden.findById(uid);

    if(!ordenExiste){
        return res.status(400).json({
            ok: false,
            msg: 'la orden no existe'
        });
    }

    const registrarOrden = await Orden.findByIdAndUpdate(uid, {estado: 'registrado'}, {new: true});

    return res.status(200).json({
        ok: true,
        msg: registrarOrden
    });
}

const getOrden = async (req, res = response) => {

    const uid = req.params.id;

    const orden = await Orden.findById(uid, {})
    .populate('proveedor', 'nombre')
    .populate('productos.producto', 'nombre');

    if(!orden){
        return res.status(400).json({
            ok: false,
            msg: 'la orden no existe'
        });
    }

    return res.status(200).json({
        ok: true,
        orden
    });
}

const desmarcar = async (req, res = response) => {

    const uid = req.params.id;

    const ordenExiste = await Orden.findById(uid);

    if(!ordenExiste){
        return res.status(400).json({
            ok: false,
            msg: 'la orden no existe'
        });
    }

    const registrarOrden = await Orden.findByIdAndUpdate(uid, {estado: 'pendiente'}, {new: true});
    
    if(registrarOrden.ordenCompra){
        await EntradasProveedor.findOneAndDelete({ordenCompra: registrarOrden.ordenCompra});
    }


    return res.status(200).json({
        ok: true,
        msg: registrarOrden
    });
}

module.exports = {
    desmarcar,
    getOrden,
    crearOrdenes,
    getOrdenes,
    editar,
    registrar,
    eliminar
}