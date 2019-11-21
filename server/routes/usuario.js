const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const _ = require('underscore')

const Usuario = require('../models/usuario')
const Amistad = require('../models/amistad')

//middleware
const {verificarToken,verificarADMIN_ROLE} = require('../middlewares/autenticacion.js')

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

app.post('/registro', (req,res)=>{
    
    let body = req.body
    
    let usuario = new Usuario({
        nombre:body.nombre,
        email:body.email,
        password:bcrypt.hashSync(body.password,10),
        role:body.role
    })

    usuario.save((err,usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                error:err
            })
        }

        res.status(201).json({
            ok:true,
            usuario:usuarioDB
        })
    })
})

app.get('/usuarios',verificarToken , (req, res) => {
    
    //los parametros opcionales vienen dentro de req.query
    let desde = Number(req.query.desde) || 0
    let limite = Number(req.query.limite) || 5

    //con el segundo atributo enviamos los campos que queremos devolver en la respuesta
    //con populate podemos devolver las relaciones que establecimos en el modelo
    Usuario.find({estado:true},'nombre email google')
    .populate({ path: 'amistades', select: 'usuario_1 usuario_2' })
    .skip(desde)
    .limit(limite)
    .exec((err,usuarios)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                error:err
            })
        }

        Usuario.countDocuments({},(err,conteo)=>{
            res.json({
                ok:true,
                usuarios,
                total:conteo
            })
        })
    })
})
app.post('/usuarios',[verificarToken,verificarADMIN_ROLE], function (req, res) {
    let body = req.body

    let usuario = new Usuario({
        nombre:body.nombre,
        email:body.email,
        password:bcrypt.hashSync(body.password,10),
        role:body.role
    })

    usuario.save((err,usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                error:err
            })
        }

        res.status(201).json({
            ok:true,
            usuario:usuarioDB
        })
    })
})
app.put('/usuarios/:id', [verificarToken,verificarADMIN_ROLE],function (req, res) {
    let id = req.params.id
    
    //usando la libreria de underscore para quitar los atributos que no deben ser actualizados usando la 
    //funcion pick
    let body = _.pick(req.body,['nombre','email','img','role','estado'])

    //es necesario agregar la opcion context:'query', debido a las validaciones de los campos unicos
    //de lo contrario tira un error
    Usuario.findByIdAndUpdate(id,body,{new:true,runValidators:true,context: 'query'},(err,usuarioDB)=>{
        
        if(err){
            return res.status(400).json({
                ok:false,
                error:err
            })
        }

        res.json({
            ok:true,
            usuario:usuarioDB
        })
    })
    
})
app.delete('/usuarios/:id', [verificarToken,verificarADMIN_ROLE],function (req, res) {
    
    let id = req.params.id
    let body = {
        estado:false
    }
    Usuario.findByIdAndUpdate(id,body,{new:true},(err,usuarioBorrado)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                error:err
            })
        }

        if(!usuarioBorrado){
            return res.status(400).json({
                ok:false,
                error:{
                    message:"usuario no encontrado"
                }
            })
        }

        res.json({
            ok:true,
            usuario:usuarioBorrado
        })

    })

    //lo remueve de la base de datos
    // Usuario.findByIdAndRemove(id,(err,usuarioBorrado)=>{
    //     if(err){
    //         return res.status(400).json({
    //             ok:false,
    //             error:err
    //         })
    //     }

    //     if(!usuarioBorrado){
    //         return res.status(400).json({
    //             ok:false,
    //             error:{
    //                 message:"usuario no encontrado"
    //             }
    //         })
    //     }

    //     res.json({
    //         ok:true,
    //         usuario:usuarioBorrado
    //     })
    // })
})

app.get('/usuarios/:id/amigos',(req,res)=>{
    let id = req.params.id
    //obtiene los amigos de un usuario por medio del usuario (para esto se necesita del campo amistades
    //del modelo usuario el cual apunta al modelo Amistad)
    // Usuario.findById(id)
    // .populate({
    //     path:'amistades',
    //     populate : [
    //         {path : 'usuario_1',select:'nombre email'},
    //         {path: 'usuario_2',select: 'nombre email'}
    //     ]
    // })
    // .exec((err,usuarioDB)=>{
    //     if(err){
    //         return res.status(400).json({
    //             ok:false,
    //             error:err
    //         })
    //     }

    //     res.json({
    //         ok:true,
    //         amistades:usuarioDB.amistades
    //     })
    // })



    //busca en la tabla amistad donde la amistad este activa y donde el usuario_1 o usuario_2 sea el id
    //del usuario que solicita a sus amigos
    Amistad.find({ activa:true , $or: [ { usuario_1: id }, { usuario_2: id } ] })
    .populate([
        {path:'usuario_1', select:'nombre email'},
        {path: 'usuario_2', select:'nombre email'}
    ])
    .exec((err,amistades)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                error:err
            })
        }

        res.json({
            ok:true,
            amistades
        })
    })
})

module.exports = app;