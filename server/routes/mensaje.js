const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const _ = require('underscore')

const Usuario = require('../models/usuario')
const Mensaje = require('../models/mensaje')

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

app.get('/mensajes/usuario/:uid/amigo/:aid',(req,res)=>{
    //busca todos los mensajes entre el usuario y un amigo
    let uid = req.params.uid
    let aid = req.params.aid
    Mensaje.find({$or:[
        {de_id:uid,para_id:aid},
        {de_id:aid,para_id:uid}
    ]}).exec((err,mensajes)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                error:err
            })
        }

        res.status(201).json({
            ok:true,
            mensajes
        })
    })
})

app.post('/enviar_mensaje',[verificarToken],(req,res)=>{
    let body = req.body
    
    let mensaje = new Mensaje({
        mensaje:body.mensaje,
        de_id:body.de_id,
        para_id:body.para_id
    })

    mensaje.save((err,mensaje)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                error:err
            })
        }

        res.status(201).json({
            ok:true,
            mensaje
        })
    })
})

module.exports = app;