//==============================
//puerto
//==============================
process.env.PORT = process.env.PORT || 3000

//==============================
// Entorno
//==============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//==============================
// Base de datos
//==============================
let urlDB
// if(process.env.NODE_ENV == 'dev'){
//     urlDB = 'mongodb://localhost:27017/restserver'
// }else{
    urlDB = 'mongodb+srv://lordatom:janoncho90@cluster0-np50m.mongodb.net/restserver'
// }

process.env.URL_DB = urlDB