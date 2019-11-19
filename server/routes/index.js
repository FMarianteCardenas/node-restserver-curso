const express = require('express')
const app = express()

//importacion de rutas
const usuario = require('./usuario.js')
const login = require('./login.js')

app.use(usuario,login)

module.exports = app;