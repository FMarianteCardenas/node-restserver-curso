//==============================
//puerto
//==============================
process.env.PORT = process.env.PORT || 3000

//==============================
// Entorno
//==============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//==============================
// Vencimiento del Token segundos(60) * minutos(60) * horas(24) * dias(30)
//==============================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30

//==============================
// Semilla de autenticacion del token
//==============================

process.env.SEED = process.env.SEED || 'seed-desarrollo'
//==============================
// Base de datos
//==============================
let urlDB
if(process.env.NODE_ENV == 'dev'){
    urlDB = 'mongodb://localhost:27017/restserver'
}else{
    //urlDB = 'mongodb+srv://lordatom:janoncho90@cluster0-np50m.mongodb.net/restserver'
    urlDB = 'mongodb+srv://admin-restserver:1451.r2d2@cluster0-np50m.mongodb.net/restserver'

}

process.env.URL_DB = urlDB