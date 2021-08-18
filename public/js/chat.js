// const socket = io();

const urlGoogle = 'http://localhost:8090/api/auth/google';
const urlManual = 'http://localhost:8090/api/auth/';


let usuario = null;
let socket  = null;


// Referencias HTML
const txtUid     = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir   = document.querySelector('#btnSalir');



const validarJWT = async() => {

    // obtenemos el token que se encuentra el localstorage
    const token = localStorage.getItem('token') || '';
    
    // validacion del token
    if ( token.length <= 10 ) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    // validamos si el token es correcto con el back y lo renovamos

    const resp = await fetch( urlManual, {
        headers: { 'x-token': token }
    });


    // pasamos la respuest a json
    // desestructuramos la respuesta en userDB y tokenDB
    const { usuario: userDB, token: tokenDB } = await resp.json();

    // asignamos el nuevo token al localstorage
    localStorage.setItem('token', tokenDB );
    // asignamos los datos del usuario
    usuario = userDB;
    document.title = usuario.nombre;
    await conectarSocket();

}

const conectarSocket = async() => {

    // extraHeaders : ya viene en el paquete de socket y nos sirve para enviar informacion al backend
    // x-token: es cualquier nombre
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });
    socket.on('connect', () =>{
        console.log('Sockets online')
    });

    socket.on('disconnect', () =>{
        console.log('Sockets offline')
    });


    // escuchando los mensajes desde el backend
    socket.on('recibir-mensajes', (mensajes )=>{
        dibujarMensajes(mensajes);
    } );

    // estar listo para ver los usuarios activos
    socket.on('usuarios-activos', (usuarios) => {
        dibujarUsuarios(usuarios);
    } );

    socket.on('mensaje-privado', ( payload ) => {
        console.log('Privado:', payload )
    });
    
}

const dibujarMensajes = ( mensajes = []) => {
    let mensajesHTML = '';
    mensajes.forEach( ({ nombre, mensaje }) => {

        mensajesHTML += `
            <li>
                <p>
                    <span class="text-primary">${ nombre }: </span>
                    <span>${ mensaje }</span>
                </p>
            </li>
        `;
    });

    ulMensajes.innerHTML = mensajesHTML;
}

const dibujarUsuarios = ( usuarios = []) => {
    let usersHtml = '';
    usuarios.forEach( ({ nombre, uid }) => {

        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success"> ${ nombre } </h5>
                    <span class="fs-6 text-muted">${ uid }</span>
                </p>
            </li>
        `;
    });

    ulUsuarios.innerHTML = usersHtml;
}

btnSalir.addEventListener('click', ()=> {

    localStorage.removeItem('token');

    window.location = 'index.html';
});


txtMensaje.addEventListener('keyup', ({ keyCode }) => {

    const mensaje = txtMensaje.value;
    const uid     = txtUid.value;


    if( keyCode !== 13 ){ return; }
    if( mensaje.length === 0 ){ return; }

    socket.emit('enviar-mensaje', { mensaje, uid });

    txtMensaje.value = '';

})

const main = async() => {
    await validarJWT();
}

main();