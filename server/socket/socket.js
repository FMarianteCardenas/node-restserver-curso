const {io} = require('../server.js')

io.on('connection',(cliente)=>{
    console.log('se ha conectado un usuario',cliente.id);
    cliente.on('disconnect',()=>{
      console.log('usuario desconectado',cliente.id);
    })
  
    //escuchar al cliente
    cliente.on('enviar_mensaje',(mensaje)=>{
      console.log('mensaje',mensaje);
      cliente.broadcast.emit('nuevo_mensaje',mensaje)
    })
  })