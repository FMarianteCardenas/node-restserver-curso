var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mensajeSchema = new Schema({
    fecha:{type:Date,default:Date.now},
    mensaje:  {type:String,required:[true,'El mensaje es requerido']},
    de_id: {type:String,required:[true,'El id de quien envía el mensaje es obligatorio']},
    para_id:{type:String,required:[true,'El id de quien recibe el mensaje es obligatorio']},
    leido: {type:Boolean,default:false},
});

module.exports = mongoose.model('Mensaje',mensajeSchema);