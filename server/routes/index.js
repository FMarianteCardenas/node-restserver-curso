const express = require('express')
const app = express()

//importacion de rutas
const usuario = require('./usuario.js')
const login = require('./login.js')
const mensaje = require('./mensaje.js')
const amistad = require('./amistad.js')

app.use(usuario,login,mensaje,amistad)

module.exports = app;