const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Amistad = require('./amistad.js')
let Schema = mongoose.Schema;

let rolesValidos = {
    values:['ADMIN_ROLE','USER_ROLE'],
    message:'{VALUE} no es un rol válido'
}

let usuarioSchema = new Schema({
    nombre:{
        type:String,
        required:[true,'El nombre es obligatorio']
    },
    email:{
        type:String,
        unique:true,
        required:[true,'El correo es obligatorio']
    },
    password:{
        type:String,
        required:[true,'La contraseña es obligatoria']
    },
    img:{
        type:String,
        required:false
    },
    role:{
        type:String,
        required:[true,'El rol es obligatorio'],
        default:'USER_ROLE',
        enum: rolesValidos
    },
    estado:{
        type:Boolean,
        default:true
    },
    google:{
        type:Boolean,
        default:false
    },
    amistades: [{ type: Schema.Types.ObjectId, ref: 'Amistad' }],
});

//personalizando el método toJSON del schema para ocultar el password en las respuestas
usuarioSchema.methods.toJSON = function(){
    let user = this
    let userObject = user.toObject()
    delete userObject.password
    return userObject
}

usuarioSchema.plugin(uniqueValidator,{
    message:'{PATH} debe de ser único'
})
module.exports = mongoose.model('Usuario',usuarioSchema);