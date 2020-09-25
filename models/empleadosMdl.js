const {Schema, model} = require ('mongoose');

const EmpleadoSchema = Schema({
    
    idInterno       :{type: String, required: true, unique: true},
    nombre          :{type: String, required: true},
    correo          :{type: String, unique: true},
    telefono        :{type: Number, required: true, unique: true},
    emergencia      :{type: Number},
    puesto          :{type: String, required: true},
    departamento    :{type: Schema.Types.ObjectId, ref: 'Departamento'  },
    direccion       :{type: String},
    ciudad          :{type: String},
    sangre          :{type: String},
    sexo            :{type: String, required: true},
    img             :{type: String},

});

EmpleadoSchema.method('toJSON', function(){
    const {__v, _id, ...object} = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Empleado', EmpleadoSchema);