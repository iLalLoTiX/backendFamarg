const {Schema, model} = require ('mongoose');

const noIdoneoSchema = Schema({
    
    destino         :{type: String, required: true}

});

noIdoneoSchema.method('toJSON', function(){

    const {__v, _id, ...object} = this.toObject();
    object.uid = _id;
    return object;
    
});

module.exports = model('NoIdoneo', noIdoneoSchema);