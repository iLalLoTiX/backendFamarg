const {Schema, model} = require ('mongoose');

const EntradasCajasSchema = Schema({
    
    chofer          :{type: Schema.Types.ObjectId, ref: 'Empleado'},
    copilotos       :{type: Schema.Types.ObjectId, ref: 'Empleado'},
    cajas           :[{
                        caja: {type: Schema.Types.ObjectId, ref: 'Caja'},
                        cantidad: {type: Number}
                    }],
    revisado        :{type: Boolean, default: false, required: true},
    fechaEntrada    :{type: Date},
});

EntradasCajasSchema.method('toJSON', function(){

    const {__v, _id, ...object} = this.toObject();
    object.uid = _id;
    return object;
    
});

module.exports = model('EntradasCajas', EntradasCajasSchema);