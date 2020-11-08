const {Schema, model} = require ('mongoose');

const OrdenesSchema = Schema({
    
    ordenCompra     :{type: String, required: true},
    proveedor       :{type: Schema.Types.ObjectId, required: true, ref: 'Contacto'},
    productos       :
                    [
                        {
                            producto: {type: Schema.Types.ObjectId, required: true, ref: 'Producto'},
                            cantidad: {type: Number}                    
                        }
                    ],
    estado          :{type: String, required: true, default: 'pendiente'},
    fechaDeEntrada  :{type: Date},

});

OrdenesSchema.method('toJSON', function(){
    const {__v, _id, ...object} = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Ordenes', OrdenesSchema);