const { Socket } = require("socket.io");
const { comprobarJWT2 } = require("../helpers/generar-jwt");
const { ChatMensajes } = require('../models');
const chatMensajes = new ChatMensajes();
const socketController = async (socket = new Socket(), io) => {

    // comprabar si es token es valido a nivel de backend
    // socket.handshake.headers['x-token'] : token que se envia desde el front
    const usuario = await comprobarJWT2(socket.handshake.headers['x-token']);

    if (!usuario) {
        return socket.disconnect();
    }

    // agregamos el usuario que se conecta
    chatMensajes.conectarUsuario(usuario);
    // emitir a todos los usuarios activos 
    // socket.broadcast.emi o el solo el io (pero hay pasarlo como parametro)
    io.emit('usuarios-activos', chatMensajes.usuariosArr);

    // muestra si hay mensajes cuando se conecta
    socket.emit('recibir-mensajes', chatMensajes.ultimos10);

    // Limpiar cuando alguien se desconeta
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    })


    // Conectarlo a una sala especial
    // inicialmente hay una sala globla, y una sala por socket.id
    // con el join se crea una nueva sala llamado usuario.id 
    socket.join(usuario.id); // global, socket.id, usuario.id => usuario.id: es el uid 


    // apto para recibir mensaje
    socket.on('enviar-mensaje', ({ uid, mensaje }) => {

        if (uid) {
             // Mensaje privado
            socket.to( uid ).emit( 'mensaje-privado', { de: usuario.nombre, mensaje });
        } else {
            // guarda los mensajes en la lista
            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
            // envia los mensajes para todos tambien se podria hacer con el socket.broadcast
            io.emit('recibir-mensajes', chatMensajes.ultimos10);
        }

    })
}


module.exports = {
    socketController
}