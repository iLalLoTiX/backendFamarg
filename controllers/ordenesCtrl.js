const { response } = require('express');
var moment = require('moment');
const bcrypt = require('bcryptjs');

const Producto = require('../models/productoMdl');
const Contacto = require('../models/contactoMdl');
const Orden    = require('../models/ordenMdl');

const getOrdenes = async (req, res = response) => {
    
    var m = moment().format('YYYY-M-DD');

    const limpiar = await Orden.remove({fechaDeEntrada: {$lt: m}});
    console.log(limpiar);
    const orden = await Orden.find({})
    .populate('proveedor', 'nombre')
    .populate('productos.producto', 'nombre');
    
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

    var fechaInicio = new Date(Math.min.apply(null,arrayFechas));
    var fechaFin = new Date(Math.max.apply(null,arrayFechas));
    
    // local
    // var desde = moment(m);
    // var hasta = moment(fechaFin).add(1, 'days');

    // heroku
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
        
        const productoDB = await Producto.findById(req.body.productos[i].producto);

        if(!productoDB){
            return res.status(404).json({
                ok: false,
                msg: 'El producto no existe',
            });
        }
    }
    
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

    const registrarOrden = await Orden.findByIdAndRemove(uid);

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

    const ordenExiste = await Orden.findById(uid, {})
    .populate('proveedor', 'nombre')
    .populate('productos.producto', 'nombre');

    if(!ordenExiste){
        return res.status(400).json({
            ok: false,
            msg: 'la orden no existe'
        });
    }

    return res.status(200).json({
        ok: true,
        msg: ordenExiste
    });
}

module.exports = {
    getOrden,
    crearOrdenes,
    getOrdenes,
    editar,
    registrar,
    eliminar
}