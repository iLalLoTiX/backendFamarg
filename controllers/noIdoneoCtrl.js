const { response } = require('express');

const bcrypt = require('bcryptjs');

const NoIdoneo = require('../models/noIdoneoMdl');

const getDestino = async (req, res = response) => {
    const destino = await NoIdoneo.find()

    return res.status(200).json({
        ok: true,
        destino
    });
}

const crearDestino = async (req, res = response) =>{

    const {destino} = req.body;

    try {

        const destinoExiste = await NoIdoneo.findOne({destino});

        if(destinoExiste){
            return res.status(404).json({
                ok: false,
                msg: 'El destino ya existe'
            });
        }

        const noIdoneo = new NoIdoneo(req.body);

        await noIdoneo.save();

        return  res.status(200).json({
            ok: true,
            noIdoneo
        });
        
    } catch (error) {

        res.status(500).json({
            ok: false,
            error
        });

    }
};

const actualizarDestino = async (req, res = response) =>{

    const uid = req.params.id;

    try {
        const destinoExiste = await NoIdoneo.findById(uid);

        if(!destinoExiste){
            return res.status(404).json({
                ok: false,
                msg: 'El el destino no existe',
            });
        }

        const {destino} = req.body;
        console.log(destinoExiste.destino, destino);
        if(destinoExiste.destino !== destino){
            const existeNombre = await NoIdoneo.findOne({destino: destino});
            if(existeNombre){
                return res.status(400).json({
                    ok: false,
                    msg: 'Este nombre ya esta registrado'
                });
            }
        }
        
        console.log(destino);
        const actualizarDestino = await NoIdoneo.findByIdAndUpdate(uid, {destino: destino}, {new: true});
        
        return  res.status(200).json({
            ok: true,
            actualizarDestino
        });
        
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            error
        });
    }
};

const buscarDestino = async (req, res) =>{

    const busqueda = req.params.destino;
    const regex = new RegExp(busqueda, 'i');
    const destinos = await NoIdoneo.find({ destino: regex }, 'destino');
    
    return  res.json({
        ok: true,
        destinos
    });
};

const buscarDestinoEstricto = async (req, res) =>{

    const busqueda = req.params.destino;
    if(busqueda === ''){
        return res.status(400).json({
            ok: false,
            msg: 'el destino no existe'
        });
    }

    const destino = await NoIdoneo.findOne({ destino: busqueda }, 'destino');
    
    if(!destino){
        return res.status(400).json({
            ok: false,
            msg: 'el destino no existe'
        });
    }

    return  res.json({
        ok: true,
        destino,
        uid: req.uid
    });
};

module.exports = {
    buscarDestinoEstricto,
    buscarDestino,
    crearDestino,
    actualizarDestino,
    getDestino
}