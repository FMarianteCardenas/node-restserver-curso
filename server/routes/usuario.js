const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const _ = require('underscore')

const Usuario = require('../models/usuario')

app.get('/usuarios', function (req, res) {
    
    //los parametros opcionales vienen dentro de req.query
    let desde = Number(req.query.desde) || 0
    let limite = Number(req.query.limite) || 5

    //con el segundo atributo enviamos los campos que queremos devolver en la respuesta
    Usuario.find({estado:true},'nombre email google')
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
app.post('/usuarios', function (req, res) {
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
app.put('/usuarios/:id', function (req, res) {
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
app.delete('/usuarios/:id', function (req, res) {
    
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

module.exports = app;