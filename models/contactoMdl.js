const {Schema, model} = require ('mongoose');

const ContactoSchema = Schema({
    nombre:     {
        type: String,
        required: true,
    },
    telefono:   {
        type: String,
    },
    relacion:   {
        type: String,
        required: true,
        default: 'proveedor'
    },
    img:        {
        type: String
    }
});

ContactoSchema.method('toJSON', function(){
    const {__v, _id, ...object} = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Contacto', ContactoSchema);