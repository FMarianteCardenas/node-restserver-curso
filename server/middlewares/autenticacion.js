const jwt = require('jsonwebtoken')

//========================
// Verificar token
//========================

let verificarToken = ( req, res, next ) => {
    let token = req.get('Authorization')
    //funcion que verifica el token enviado en el request
    //recibe el token,el seed o semilla y retorna un error o respuesta(datos del payload del request)
    jwt.verify(token, process.env.SEED, (err,decoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                error:{
                    message:"Token Inválido, Te Pillamos Compadre :V"
                }
            })
        }

        req.usuario = decoded.usuario
        next()
    })
    
    
}

//========================
// Verificar ADMIN_ROLE
//========================

let verificarADMIN_ROLE = ( req, res, next) => {
    let usuario = req.usuario
    if(usuario.role === 'ADMIN_ROLE'){
        next()
    }else{
        
        return res.status(401).json({
            ok:false,
            message: "Acceso Denegado"
        })
    }

}

module.exports = {
    verificarToken,verificarADMIN_ROLE
}