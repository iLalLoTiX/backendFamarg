const { response } = require('express');

const bcrypt = require('bcryptjs');

const Empleado = require('../models/empleadosMdl');

/*
    CRUD: GET, POST, PUT, DELETE
*/
const buscarEmpleadosPuesto = async (req, res) => {
    
    const busqueda = req.params.busqueda;

    const regex = new RegExp(busqueda, 'i');

    const empleados = await Empleado.find({ puesto: regex}, 'nombre');

    return res.status(200).json({
        ok: true,
        empleados: empleados
    })
    
}

const buscarEmpleados = async (req, res) => {
    
    const busqueda = req.params.busqueda;

    const regex = new RegExp(busqueda, 'i');

    const empleados = await Empleado.find({ nombre: regex});

    return res.status(200).json({
        ok: true,
        empleados: empleados
    })
    
}

const totalEmpleados = async (req, res) => {
    
    const total = await Empleado.countDocuments();
    try {
        return res.status(200).json({
            ok: true,
            total
        })
    } catch (error) {
        return res.status(400).json({
            ok: false,
            total: 'Ha habido un error'
        })
    }
    
}

const getEmpleado = async (req, res) =>{

    const uid = req.params.id;
    const empleado = await Empleado.findById(uid, 'nombre img idInterno puesto telefono sexo correo direccion ciudad ciudad emergencia sangre')
    .populate('departamento','nombre');

    return  res.json({
        empleado
    });
};

const getEmpleados = async (req, res) =>{

    const desde = Number(req.query.desde) || 0;

    const empleados = await Empleado.find({}, 'nombre img idInterno puesto telefono sexo correo direccion ciudad ciudad departamento emergencia sangre').
    populate('departamento', 'nombre').limit(20);

    return  res.json({
        empleados
    });
};

const crearEmpleado = async (req, res = response) =>{

    const {idInterno, telefono, correo,} = req.body;

    try {

        const idExiste = await Empleado.findOne({idInterno});
        const telefonoExiste = await Empleado.findOne({telefono});
        const correoExiste = await Empleado.findOne({correo});

        if(idExiste){
            return res.status(400).json({
                ok: false,
                msg: 'El ID Interno ya existe'
            });
        }

        if(telefonoExiste){
            return res.status(400).json({
                ok: false,
                msg: 'El telefono ya existe'
            });
        }

        if(correoExiste){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya existe'
            });
        }

        const empleado = new Empleado(req.body);
        await empleado.save();

        return  res.json({
            ok: true,
            empleado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperado'
        });
    }

};

const actualizarEmpleado = async (req, res = response) =>{

    const uid = req.params.id;

    try {

        const empleadoDB = await Empleado.findById(uid);
        if(!empleadoDB){
            return res.status(404).json({
                ok: false,
                msg: 'La chofer no existe',
            });
        }

        const {idInterno, telefono, correo, ...campos} = req.body;

        if(empleadoDB.idInterno !== idInterno){
            const existeId = await Empleado.findOne({idInterno});
            if(existeId){
                return res.status(400).json({
                    ok: false,
                    msg: 'Este ID ya esta registrado'
                });
            }
        }

        if(empleadoDB.telefono !== telefono){
            const existeTelefono = await Empleado.findOne({telefono});
            if(existeTelefono){
                return res.status(400).json({
                    ok: false,
                    msg: 'Este telefono ya esta registrado'
                });
            }
        }

        if(empleadoDB.correo !== correo){
            const existeCorreo = await Empleado.findOne({correo});
            if(existeCorreo){
                return res.status(400).json({
                    ok: false,
                    msg: 'Este correo ya esta registrado'
                });
            }
        }

        campos.idInterno = idInterno;
        campos.telefono = telefono;
        campos.correo = correo;

        const actualizarEmpleado = await Empleado.findByIdAndUpdate(uid, campos, {new: true});
        
        return res.json({
            ok: true,
            empleado: actualizarEmpleado
        });
        
    } catch (error) {
        return res.status(404).json({
            ok: false,
            msg: 'Error al actualizar',
            req
        });
    }
    
};

const borrarEmpleado = async (req, res = response) =>{

    const uid = req.params.id

    try 
    {

        const empleadoExiste = await Empleado.findById(uid);

        if(!empleadoExiste){
            return res.json({
                ok: false,
                msg: 'El empleado no existe',
                req
            });
        }

        await Empleado.findByIdAndDelete(uid);
        
        return res.json({
            ok: true,
            msg: 'Empleado borrado'
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
    buscarEmpleadosPuesto,
    buscarEmpleados,
    totalEmpleados,
    getEmpleado,
    getEmpleados,
    crearEmpleado,
    actualizarEmpleado,
    borrarEmpleado
}