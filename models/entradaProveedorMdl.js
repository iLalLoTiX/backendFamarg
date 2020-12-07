const {Schema, model} = require ('mongoose');

const EntradaProveedorSchema = Schema({
    
    ordenCompra     :{type: String},
    proveedor       :{type: Schema.Types.ObjectId, required: true, ref: 'Contacto'},
    productos       :
    [
        {
            producto:
            {type: Schema.Types.ObjectId, required: true, ref: 'Producto'},
            cantidad:
                {type: Number, required: true},
            cajas:
            [
                {
                    caja            :{type: Schema.Types.ObjectId, ref: 'Caja'},
                    cantidadCajas   :{type: Number} 
                }
            ],
            precio:
            {type: Number, default: 0},
            noIdoneo:
            [
                {
                destino:
                    {type: Schema.Types.ObjectId, ref: 'NoIdoneo'},
                cantidad:
                    {type: Number} 
                }
            ],
            totalMerma:
            {type: Number, required: true, default: 0}                  
        }
    ],
    fechaDeEntrada  :{type: Date, required: true},
    totalCosto      :{type: Number, required: true, default: 0},
    estado          :{type: Boolean, required: true, default: false},
});

EntradaProveedorSchema.method('toJSON', function(){

    const {__v, _id, ...object} = this.toObject();
    object.uid = _id;
    return object;
    
});

module.exports = model('EntradasProveedor', EntradaProveedorSchema);