const {Schema, model} = require ('mongoose');

const ProductoSchema = Schema({
    nombre:     {
        type: String,
        required: true,
        unique: true
    },
    sku:     {
        type: String,
        required: true,
        unique: true
    },
    categoria:     {
        type: String,
        required: true,
    },
    img:        {
        type: String
    }
});

ProductoSchema.method('toJSON', function(){
    const {__v, _id, ...object} = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Producto', ProductoSchema);