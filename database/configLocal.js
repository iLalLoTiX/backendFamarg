const mongoose = require('mongoose');
require('dotenv').config();

const dbConnection = async () => {
    try{
        await mongoose.connect('localhost:27017/famarg', 
        {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('DB online');
    }catch(error){
        console.log(error);
        throw new Error('Error a la hora de iniciar de BD ver logs');
    }   
}

module.exports = {
    dbConnection
}