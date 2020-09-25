const {Schema, model} = require ('mongoose');

const CajaSchema = Schema({
    nombre:     {
        type: String,
        required: true,
        unique: true,
    },
    peso:       {
        type: Number,
        required: true
    },
    precio:     {
        type: Number,
        required: true
    },
    img:        {
        type: String
    },
    inventario: {
        type: Number,
        default: 0
    },
    rotas:      {
        type: Number,
        default: 0
    },
    perdidas:   {
        type: Number,
        default: 0
    }
});

CajaSchema.method('toJSON', function(){
    const {__v, _id, ...object} = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Caja', CajaSchema);