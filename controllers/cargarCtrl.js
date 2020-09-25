const path = require('path');

const fs = require('fs');
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const {actualizarImagen} = require('../helpers/actualizarImagen');

//CargarImagen
const cargarImagen = async (req, res = response) =>{
    
    const tipo  = req.params.tipo;
    const id    = req.params.id;

    const tiposValidos = ['empleados', 'usuarios'];
    if(!tiposValidos.includes(tipo)){
        return res.status(400).json({
            ok: false,
            msg: 'No es un usuario o empleado (tipo)'
        });
    }

    //Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No se mando ningun archivo'
        });
    }

    //Procesar de la imagen
    const file = req.files.imagen;
    const nombreCortado = file.name.split('.');
    const extencionArchivo = nombreCortado[ nombreCortado.length- 1 ];

    // Validar extencion
    const extencionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    if(!extencionesValidas.includes( extencionArchivo)){
        return res.status(400).json({
            ok: false,
            msg: 'No es una extencion valida'
        });
    }

    //Generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extencionArchivo}`;
    const path = `uploads/${tipo}/${ nombreArchivo }`;

    // Mover la imagen
    file.mv(path, (err) => {
        if (err){
            console.log(err);
            return res.status(500).json({
                ok: false,
                err,
                img: 'error ponganse en contacto con el adminsitrador'
            });
        }
        
        actualizarImagen(tipo, id, nombreArchivo, res);
    
    });

    return  res.json({
        ok: true,
        img: 'exito',
        nombreArchivo
    });
};

//Mostrar imagen
const mostrarImagen = async (req, res = response) =>{
    const tipo  = req.params.tipo;
    const foto  = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    }else{
        const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
        res.sendFile(pathImg);
    }
}

module.exports = {
    mostrarImagen,
    cargarImagen
}