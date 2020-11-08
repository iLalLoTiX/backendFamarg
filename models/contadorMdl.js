const {Schema, model} = require ('mongoose');

const ContadorSchema = Schema({

    indice  :{type: Number},

});

ContadorSchema.method('toJSON', function(){
    const {__v, _id, ...object} = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Contador', ContadorSchema);