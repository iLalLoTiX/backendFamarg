const { response } = require('express');

const bcrypt = require('bcryptjs');

const Cajas = require('../models/cajaMdl');

/*
    CRUD: GET, POST, PUT, DELETE
*/

const getCajas = async (req, res) =>{

    const cajas = await Cajas.find({}, 'nombre precio peso inventario rotas perdidas');
    
    return  res.json({
        ok: true,
        cajas,
        uid: req.uid
    });
};

const crearCajas = async (req, res = response) =>{

    const {nombre} = req.body;

    try {

        const cajaExiste = await Cajas.findOne({nombre});

        if(cajaExiste){
            return res.status(404).json({
                ok: false,
                msg: 'El nombre de caja ya existe'
            });
        }

        const cajas = new Cajas(req.body);
        console.log(cajas);
        await cajas.save();

        return  res.json({
            ok: true,
            cajas
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperado'
        });
    }
};

const actualizarCajas = async (req, res = response) =>{

    const uid = req.params.id;

    try {

        const cajaDB = await Cajas.findById(uid);
        if(!cajaDB){
            return res.status(404).json({
                ok: false,
                msg: 'La caja no existe',
            });
        }

        const {nombre, ...campos} = req.body;

        if(cajaDB.nombre !== nombre){
            const existeCaja = await Cajas.findOne({nombre});
            if(existeCaja){
                return res.status(400).json({
                    ok: false,
                    msg: 'Este nombre ya esta registrado'
                });
            }
        }

        campos.nombre = nombre;

        const actualizarCaja = await Cajas.findByIdAndUpdate(uid, campos, {new: true});
        
        return res.json({
            ok: true,
            usuario: actualizarCaja
        });
        
    } catch (error) {
        return res.status(404).json({
            ok: false,
            msg: 'Error al actualizar',
            req
        });
    }
    
};

const borrarCajas = async (req, res = response) =>{

    const uid = req.params.id;

    try 
    {

        const cajaExiste = await Cajas.findById(uid);

        if(!cajaExiste){
            return res.status(404).json({
                ok: false,
                msg: 'La caja no existe',
                req
            });
        }

        await Cajas.findByIdAndDelete(uid);
        
        return res.json({
            ok: true,
            msg: 'Caja borrada'
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
    getCajas,
    crearCajas,
    actualizarCajas,
    borrarCajas
}