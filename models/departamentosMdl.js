const {Schema, model} = require ('mongoose');

const EmpleadoSchema = Schema({
    
    nombre          :{type: String, required: true, unique: true},
    puestos         :{type: Object, required: true}
});

EmpleadoSchema.method('toJSON', function(){
    const {__v, _id, ...object} = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Departamento', EmpleadoSchema);