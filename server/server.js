require('./config/config.js')
const express = require('express')
const mongoose = require('mongoose');

//se usa por un warning de nodejs que dice collection.ensureIndex is deprecated. Use createIndexes instead
//mongoose.set('useCreateIndex', true);

const app = express()

const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//configuracion global de rutas
const rutas = require('./routes/index.js')


app.use(rutas)


 //conexion de mongoose con la base de datos
mongoose.connect(process.env.URL_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex :true
},(err,res)=>{
    if(err) throw err
    console.log('Conectado correctamente con la base de datos');
});

app.listen(process.env.PORT,()=>{
    console.log(`Escuchando en puerto ${process.env.PORT}`);
})