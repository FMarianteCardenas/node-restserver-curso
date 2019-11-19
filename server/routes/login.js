const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Usuario = require('../models/usuario')

app.post('/login',(req,res)=>{

    let body = req.body
    Usuario.findOne({email:body.email},(err,usuario)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                error:err
            })
        }

        if(!usuario){
            return res.status(400).json({
                ok:false,
                error:{
                    message:"Usuario o Contraseña Incorrectos"
                }
            })
        }

        if(!bcrypt.compareSync(body.password,usuario.password)){
            return res.status(400).json({
                ok:false,
                error:{
                    message:"Usuario o (Contraseña) Incorrectos"
                }
            })
        }
        

        //expiresIn segundos(60) * minutos(60) * horas(24) * dias(30)
        let token = jwt.sign({
            usuario:usuario
        },process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN})

        res.json({
            ok:true,
            usuario,
            token:token
        })
    })
})

module.exports = app;