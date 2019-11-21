const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const _ = require('underscore')

const Amistad = require('../models/amistad')
const Usuario = require('../models/usuario')

//middleware
const {verificarToken} = require('../middlewares/autenticacion.js')

//configuracion necesaria para evitar el bloqueo de cors y peticiones OPTIONS que envia axios desde el front
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    //intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
      //respond with 200
      res.sendStatus(200);
    }
    else {
    //move on
      next();
    }
});

app.post('/crear_amistad',async (req,res)=>{
    let body = req.body
    console.log('body',body);
    let amistad = new Amistad({
        usuario_1:body.usuario_id_1,
        usuario_2:body.usuario_id_2
    })

    amistad.save((err,amistad)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                error:err
            })
        }

        res.status(201).json({
            ok:true,
            amistad
        })
    })
})

module.exports = app;