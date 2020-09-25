const { response } = require('express');

const bcrypt = require('bcryptjs');

const Productos = require('../models/productoMdl');

/*
    CRUD: GET, POST, PUT, DELETE
*/

const getProductos = async (req, res) =>{

    const productos = await Productos.find({}, 'nombre categoria sku');
    
    return  res.json({
        ok: true,
        productos,
        uid: req.uid
    });
};

const getProducto = async (req, res = response) =>{
    const uid = req.params.id;

    const producto = await Productos.findById(uid);

    if(!producto){
        return res.status(404).json({
            ok: false,
            msg: 'no existe el producto'
        });
    }

    return res.status(200).json({
        ok: false,
        producto: producto
    });
};

const crearProducto = async (req, res = response) =>{

    const {nombre, sku} = req.body;

    try {

        const nombreExiste = await Productos.findOne({nombre});

        if(nombreExiste){
            return res.status(404).json({
                ok: false,
                msg: 'El nombre del producto ya existe'
            });
        }

        const skuExiste = await Productos.findOne({sku});

        if(skuExiste){
            return res.status(404).json({
                ok: false,
                msg: 'El sku del producto ya existe'
            });
        }

        const producto = new Productos(req.body);

        await producto.save();

        return  res.json({
            ok: true,
            producto
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperado'
        });
    }
};

const buscarProducto = async (req, res) =>{

    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');
    const productos = await Productos.find({ nombre: regex }, 'nombre');
    
    return  res.json({
        ok: true,
        productos,
        uid: req.uid
    });
};

const buscarProductoEstricto = async (req, res) =>{

    const busqueda = req.body.busqueda;
    if(busqueda === ''){
        return res.status(400).json({
            ok: false,
            msg: 'el producto no existe'
        });
    }

    const producto = await Productos.findOne({ nombre: busqueda }, 'nombre');
    
    if(!producto){
        return res.status(400).json({
            ok: false,
            msg: 'el producto no existe'
        });
    }

    return  res.json({
        ok: true,
        producto,
        uid: req.uid
    });
};

const actualizarProducto = async (req, res = response) =>{

    const uid = req.params.id;

    try {

        const productoDB = await Productos.findById(uid);
        if(!productoDB){
            return res.status(404).json({
                ok: false,
                msg: 'El producto no existe',
            });
        }

        const {nombre, sku, ...campos} = req.body;

        if(productoDB.nombre !== nombre){
            const existeCaja = await Productos.findOne({nombre});
            if(existeCaja){
                return res.status(400).json({
                    ok: false,
                    msg: 'Este nombre ya esta registrado'
                });
            }
        }

        if(productoDB.sku !== sku){
            const existeCaja = await Productos.findOne({sku});
            if(existeCaja){
                return res.status(400).json({
                    ok: false,
                    msg: 'Este sku ya esta registrado'
                });
            }
        }

        campos.nombre = nombre;
        campos.sku = sku;
        console.log(campos);
        const actualizarProducto = await Productos.findByIdAndUpdate(uid, campos, {new: true});
        
        return res.json({
            ok: true,
            producto: actualizarProducto
        });
        
    } catch (error) {
        return res.status(404).json({
            ok: false,
            msg: 'Error al actualizar',
            req
        });
    }
    
};

const borrarProducto = async (req, res = response) =>{

    const uid = req.params.id;

    try 
    {
        const cajaExiste = await Productos.findById(uid);

        if(!cajaExiste){
            return res.status(404).json({
                ok: false,
                msg: 'El producto no existe',
                req
            });
        }

        await Productos.findByIdAndDelete(uid);
        
        return res.json({
            ok: true,
            msg: 'Producto borrado'
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
    buscarProductoEstricto,
    buscarProducto,
    getProducto,
    getProductos,
    crearProducto,
    actualizarProducto,
    borrarProducto
}