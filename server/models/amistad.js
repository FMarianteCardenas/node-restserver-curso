var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const Usuario = require('./usuario.js')

var amistadSchema = new Schema({
    // usuario_id_1: {type:String,required:[true,'El usuario_id_1 es obligatorio']},
    // usuario_id_2:{type:String,required:[true,'El usuario_id_2 es obligatorio']},
    usuario_1:{type: Schema.Types.ObjectId,ref:'Usuario',required:[true,'usuario_1 Obligatorio']},
    usuario_2:{type: Schema.Types.ObjectId,ref:'Usuario',required:[true,'usuario_2 Obligatorio']},
    activa: {type:Boolean,default:true},
});

module.exports = mongoose.model('Amistad',amistadSchema);