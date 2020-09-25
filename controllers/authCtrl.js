const {response} =require('express');
const Usuario = require('../models/usuarioMdl');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        //Verificar EMAIL
        const usuarioDB = await Usuario.findOne({ email });

        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'El email son incorrectos'
            });
        }

        //Encryptar contraseña
        const validPass = bcrypt.compareSync(password, usuarioDB.password);

        if(!validPass){
            return res.status(400).json({
                ok: false,
                msg: 'El pass son incorrectos'
            });
        }

        // Gnerar Token

        const token = await generarJWT(usuarioDB.id);

        return res.json({
            ok: true,
            token
        });

    } catch (error) {
        console.los(error);
        res.status(500).json({
            ok: false,
            msg: 'Ponganse en contacto con el administrador'
        });
    }
}

module.exports = {
    login
}