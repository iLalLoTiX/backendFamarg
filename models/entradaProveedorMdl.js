const {Schema, model} = require ('mongoose');

const EntradaProveedorSchema = Schema({
    
    ordenCompra     :{type: String},
    proveedor       :{type: Schema.Types.ObjectId, required: true, ref: 'Contacto'},
    productos       :
                    [
                        {
                            producto    :{type: Schema.Types.ObjectId, required: true, ref: 'Producto'},
                            cantidad    :{type: Number},
                            precio      :{type: Number},
                            noIdoneo    :
                                        [
                                            {
                                                destino     :{type: Schema.Types.ObjectId, ref: 'NoIdoneo'},
                                                cantidad    :{type: Number} 
                                            }
                                        ]                  
                        }
                    ],
    fechaDeEntrada  :{type: Date},
    total           :{type: Number},
    estado          :{type: Boolean, required: true, default: false},
});

EntradaProveedorSchema.method('toJSON', function(){

    const {__v, _id, ...object} = this.toObject();
    object.uid = _id;
    return object;
    
});

module.exports = model('EntradasProveedor', EntradaProveedorSchema);