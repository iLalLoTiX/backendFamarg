const mongoose = require('mongoose');
require('dotenv').config();

const dbConnection = async () => {
    try{
        //mongodb://localhost:27017/famarg
        //mongodb+srv://famarg:famarg1628*@cluster0.dkkhm.mongodb.net/test
        await mongoose.connect(process.env.DB_CNN, 
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