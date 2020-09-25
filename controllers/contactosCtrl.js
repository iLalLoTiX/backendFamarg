const { response } = require('express');

const bcrypt = require('bcryptjs');

const Contactos = require('../models/contactoMdl');

/*
    CRUD: GET, POST, PUT, DELETE
*/

const getContactos = async (req, res= response) =>{

    const contacto = await Contactos.find({}, 'nombre telefono relacion');
    
    return  res.status(200).json({
        ok: true,
        contacto,
        uid: req.uid
    });
};

const getContacto = async (req, res) =>{

    const uid = req.params.id;

    const contacto = await Contactos.findById(uid);
    
    return  res.json({
        ok: true,
        contacto,
        uid: req.uid
    });
};

const buscarContacto = async (req, res) =>{

    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');
    const contactos = await Contactos.find({ nombre: regex }, 'nombre');
    
    return  res.json({
        ok: true,
        contactos,
        uid: req.uid
    });
};

const buscarContactoEstricto = async (req, res) =>{

    const busqueda = req.body.busqueda;
    if(busqueda === ''){
        return res.status(400).json({
            ok: false,
            msg: 'el contacto no existe'
        });
    }

    const contacto = await Contactos.findOne({ nombre: busqueda }, 'nombre');
    
    if(!contacto){
        return res.status(400).json({
            ok: false,
            msg: 'el contacto no existe'
        });
    }

    return  res.json({
        ok: true,
        contacto,
        uid: req.uid
    });
};

const crearContacto = async (req, res = response) =>{

    try {

        const contacto = new Contactos(req.body);

        await contacto.save();

        return  res.json({
            ok: true,
            contacto
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperado'
        });
    }
};

const actualizarContacto = async (req, res = response) =>{

    const uid = req.params.id;

    try {

        const contactoDB = await Contactos.findById(uid);
        
        if(!contactoDB){
            return res.status(404).json({
                ok: false,
                msg: 'El contacto no existe',
            });
        }
        
        const campos = req.body;

        const actualizarContacto = await Contactos.findByIdAndUpdate(uid, campos, {new: true});
        
        return res.json({
            ok: true,
            contacto: actualizarContacto
        });
        
    } catch (error) {
        return res.status(404).json({
            ok: false,
            msg: 'Error al actualizar',
            req
        });
    }
    
};

const borrarContacto = async (req, res = response) =>{

    const uid = req.params.id;

    try 
    {
        const contactosExiste = await Contactos.findById(uid);

        if(!contactosExiste){
            return res.status(404).json({
                ok: false,
                msg: 'El contacto existe',
                req
            });
        }

        await Contactos.findByIdAndDelete(uid);
        
        return res.json({
            ok: true,
            msg: 'Contacto borrado'
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
    buscarContactoEstricto,
    buscarContacto,
    getContacto,
    getContactos,
    crearContacto,
    actualizarContacto,
    borrarContacto
}