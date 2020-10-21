const { response } = require('express');

const bcrypt = require('bcryptjs');

const EntradasCajas = require('../models/entradasCajasMdl');

/*
    CRUD: GET, POST, PUT, DELETE
*/

// const buscarEmpleados = async (req, res) => {
    
//     const busqueda = req.params.busqueda;

//     const regex = new RegExp(busqueda, 'i');

//     const empleados = await Empleado.find({ nombre: regex});

//     return res.status(200).json({
//         ok: true,
//         empleados: empleados
//     });
// }
const filtrarFechas = async (req, res) =>{

    const fechaUno = req.params.fechaUno;
    const fechaDos = req.params.fechaDos;

    try {
        const entradasCajas = await EntradasCajas.find({fechaEntrada: {$gte: new Date(fechaUno),$lte: new Date(fechaDos)}});

        return  res.json({
            entradasCajas: entradasCajas
        });

    } catch (error) {
        return  res.status(400).json({
            error: error
        });
    }    
};

const getEntradasCajas = async (req, res) =>{

    const entradasCajas = await EntradasCajas.find({}).
    populate('chofer', 'nombre puesto').populate('copiloto', 'nombre');

    return  res.json({
        entradasCajas
    });
};

const crearEntradaCajas = async (req, res = response) =>{

    try {

        const entradaCajas = new EntradasCajas(req.body);
        entradaCajas.fechaEntrada = new Date();
        await entradaCajas.save();

        return  res.json({
            ok: true,
            entradaCajas
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperado'
        });
    }
};

const actualizarEntradaCajas = async (req, res = response) =>{

    const uid = req.params.id;

    try {

        const entradasCajasDB = await EntradasCajas.findById(uid);
        if(!entradasCajasDB){
            return res.status(400).json({
                ok: false,
                msg: 'La entrada de cajas no existe',
            });
        }

        const actualizarEntradaCajas = await EntradasCajas.findByIdAndUpdate(uid, req.body, {new: true});
        
        return res.json({
            ok: true,
            EntradaCajas: actualizarEntradaCajas
        });
        
    } catch (error) {
        return res.status(404).json({
            ok: false,
            msg: 'Error al actualizar',
            req
        });
    }
    
};

const borrarEntradaCajas = async (req, res = response) =>{

    const uid = req.params.id

    try 
    {

        const entradasCajasDB = await EntradasCajas.findById(uid);

        if(!entradasCajasDB){
            return res.status(400).json({
                ok: false,
                msg: 'La entrada de cajas no existe',
            });
        }

        await EntradasCajas.findByIdAndDelete(uid);
        
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
    getEntradasCajas,
    crearEntradaCajas,
    actualizarEntradaCajas,
    borrarEntradaCajas,
    filtrarFechas
}