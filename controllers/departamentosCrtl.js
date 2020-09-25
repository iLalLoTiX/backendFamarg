const { response } = require('express');

const bcrypt = require('bcryptjs');

const Departamento = require('../models/departamentosMdl');

/*
    CRUD: GET, POST, PUT, DELETE
*/

const getDepartamentos = async (req, res) =>{
    const departamentos = await Departamento.find({}, 'nombre puestos descripcion').limit(20);
    
    return  res.json({
        ok: true,
        departamentos,
        uid: req.uid
    });
};

const getDepartamento = async (req, res) =>{
    
    const uid = req.params.id;

    try {

        const departamento = await Departamento.findById(uid);
        
        if(!departamento){
            return res.status(404).json({
                ok: false,
                msg: 'El departamento no existe',
            });
        }

        return res.json({
            ok: true,
            departamento: departamento
        });
        
    } catch (error) {
        return res.status(404).json({
            ok: false,
            msg: 'Error al actualizar',
            req
        });
    }
};

const crearDepartamento = async (req, res = response) =>{
    const {nombre} = req.body;

    try {

        const departamentoExiste = await Departamento.findOne({nombre});

        if(departamentoExiste){
            return res.status(404).json({
                ok: false,
                msg: 'El nombre del departamento ya existe'
            });
        }

        const departamento = new Departamento(req.body);
        await departamento.save();

        return  res.json({
            ok: true,
            departamento
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperado'
        });
    }
};

const actualizarDepartamento = async (req, res = response) =>{
    
    const uid = req.params.id;

    try {

        const departamentoDB = await Departamento.findById(uid);
        if(!departamentoDB){
            return res.status(404).json({
                ok: false,
                msg: 'El departamento no existe',
            });
        }

        const {nombre, ...campos} = req.body;

        if(departamentoDB.nombre !== nombre){
            const existeDepartamento = await Departamento.findOne({nombre});
            if(existeDepartamento){
                return res.status(400).json({
                    ok: false,
                    msg: 'Este nombre ya esta registrado'
                });
            }
        }

        campos.nombre = nombre;

        const actualizarDepartamento = await Departamento.findByIdAndUpdate(uid, campos, {new: true});
        
        return res.json({
            ok: true,
            departamento: actualizarDepartamento
        });
        
    } catch (error) {
        return res.status(404).json({
            ok: false,
            msg: 'Error al actualizar',
            req
        });
    }

};

const borrarDepartamento = async (req, res = response) =>{
    
    const uid = req.params.id;

    try 
    {

        const departamentoExiste = await Departamento.findById(uid);

        if(!departamentoExiste){
            return res.status(404).json({
                ok: false,
                msg: 'El departamento no existe',
                req
            });
        }

        await Departamento.findByIdAndDelete(uid);
        
        return res.json({
            ok: true,
            msg: 'Departamento borrado'
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
    getDepartamentos,
    getDepartamento,
    crearDepartamento,
    actualizarDepartamento,
    borrarDepartamento
}