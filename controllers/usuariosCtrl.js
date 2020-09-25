const { response } = require('express');

const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuarioMdl');

const { generarJWT } = require('../helpers/jwt');

/*
    CRUD: GET, POST, PUT, DELETE
*/

const getUsuario = async (req, res) =>{

    const usuarios = await Usuario.find({}, 'nombre email role img');

    res.json({
        ok: true,
        usuarios,
        uid: req.uid
    });
};

const crearUsuario = async (req, res = response) =>{

    const { email, password} = req.body;

    try 
    {

        const emailExiste = await Usuario.findOne({email});

        if(emailExiste){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            });
        }

        const usuario = new Usuario(req.body);

        //Encryptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();
        
        const token = await generarJWT(usuario.id);
        res.json({
            ok: true,
            usuario,
            token
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

const actualizarUsuario = async (req, res = response) =>{

    const uid = req.params.id;

    try 
    {

        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario'
            });
        }

        const {password, email, ...campos} = req.body;

        if(usuarioDB.email !== email){
            const existeEmail = await Usuario.findOne({email});
            if(existeEmail){
                return res.status(400).json({
                    ok: false,
                    msg: 'Este email ya esta registrado'
                });
            }
        }

        campos.email = email;

        const actualizarUsuaio = await Usuario.findByIdAndUpdate(uid, campos, {new: true});
        
        res.json({
            ok: true,
            usuario: actualizarUsuaio
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

const borrarUsuario = async (req, res = response) =>{

    const uid = req.params.id;

    try 
    {

        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario'
            });
        }

        await Usuario.findByIdAndDelete(uid);
        
        return res.json({
            ok: true,
            msg: 'Usuario borrado'
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
    getUsuario,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}