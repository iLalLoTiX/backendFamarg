const { response } = require('express');

const bcrypt = require('bcryptjs');

const Contador = require('../models/contadorMdl');

const contar = async (req, res = response) => {
    
    function zfill(number, width) {
        var numberOutput = Math.abs(number); /* Valor absoluto del número */
        var length = number.toString().length; /* Largo del número */ 
        var zero = "0"; /* String de cero */  
        
        if (width <= length) {
            if (number < 0) {
                 return ("-" + numberOutput.toString()); 
            } else {
                 return numberOutput.toString(); 
            }
        } else {
            if (number < 0) {
                return ("-" + (zero.repeat(width - length)) + numberOutput.toString()); 
            } else {
                return ((zero.repeat(width - length)) + numberOutput.toString()); 
            }
        }
    }
    
    const inicio = await Contador.countDocuments();

    if(inicio == 0)
    {
        const indice = new Contador({indice: 1});
        await indice.save();

        console.log(indice.indice);

        enviar = zfill(indice.indice, 10);

        return enviar;

    }
    const indice = await Contador.find();

    indice[0].indice = indice[0].indice + 1;

    const nuevoIndice = await Contador.findByIdAndUpdate(indice[0]._id, {indice: indice[0].indice}, {new: true});

    enviar = zfill(nuevoIndice.indice, 10);

    return enviar;

}

module.exports = {
    contar
}