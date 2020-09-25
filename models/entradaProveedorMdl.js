const {Schema, model} = require ('mongoose');

const EntradaProveedorSchema = Schema({
    
    proveedor       :{type: Schema.Types.ObjectId, ref: 'Contacto'},
    producto        :{type: Schema.Types.ObjectId, ref: 'Producto'},
    kg              :{type: Number, required: true},
    fechaEntrada    :{type: Date, required: true},
    revisado        :{type: Boolean, default: false ,required: true},
    bueno           :{type: Number},
    malo            :{type: Number},
    feo             :{type: Number},
    fechaRevicion   :{type: Date},
});

EntradaProveedorSchema.method('toJSON', function(){

    const {__v, _id, ...object} = this.toObject();
    object.uid = _id;
    return object;
    
});

module.exports = model('EntradasProveedor', EntradaProveedorSchema);