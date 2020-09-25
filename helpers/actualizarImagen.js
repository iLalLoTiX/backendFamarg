const Empleado = require('../models/empleadosMdl');
const Usuario = require('../models/usuarioMdl');

const fs = require('fs');
const { response } = require('express');
const borrarImagen = (path) => {
    console.log('uwu');
    if(fs.existsSync(path)){
        fs.unlinkSync(path);
    }

}


const actualizarImagen = async(tipo, id, nombreArchivo, res = response) => {


    switch(tipo){
        case    'empleados':

            const empleado = await Empleado.findById(id);

            if(!empleado){
                return  res.json({
                    ok: true,
                    img: 'El empleado no existe'
                });
            }
            let pathViejoEmpelado = `uploads/empleados/${empleado.img}`;
            
            borrarImagen(pathViejoEmpelado);

            empleado.img = nombreArchivo;

            await empleado.save();

            return true;
            
        break;
        case    'usuarios':
            const usuario = await Usuario.findById(id);

            if(!usuario){
                return  res.json({
                    ok: true,
                    img: 'El usuario no existe'
                });
            }
            console.log(usuario.img);
            let pathViejoUsuarios = `uploads/usuarios/${usuario.img}`;
            console.log(fs.existsSync(pathViejoUsuarios));
            borrarImagen(pathViejoUsuarios);
            usuario.img = nombreArchivo;

            await usuario.save();
            return true;
        break;
    }
}

module.exports = {actualizarImagen}