class Mensaje {
    constructor(uid, nombre, mensaje) {
        this.uid = uid;
        this.nombre = nombre;
        this.mensaje = mensaje;
    }
}

class ChatMensajes {
    constructor() {
        // lista de mensajes
        this.mensajes = [];
        // lista de usuarios
        this.usuarios = {};
    }

    get ultimos10() {
        // realizar el corte de los 10 : splice(0,10)
        this.mensajes = this.mensajes.splice(0, 10);
        return this.mensajes;
    }

    // retornar un arreglo de todos los usuarios
    get usuariosArr() {
        return Object.values(this.usuarios); // [ {}, {}, {}]
    }

    enviarMensaje(uid, nombre, mensaje) {

        // agregar al top de la lista el mensaje
        this.mensajes.unshift(
            new Mensaje(uid, nombre, mensaje)
        );
    }

    conectarUsuario(usuario) {
        // se trabaja como objeto y cada objeto va a tener un id : usuario.id
        this.usuarios[usuario.id] = usuario
    }
    
    desconectarUsuario(id) {
        delete this.usuarios[id];
    }
}

module.exports = ChatMensajes;