// referencia al formulario para logearse en local
const miFormulario = document.querySelector('form');



// obtener la ruta para desarrollo o produccion
// var url = (window.location.hostname.includes('localhost'))
//     ? 'http://localhost:8090/api/auth/google'
//     : 'https://restserver-curso-fher.herokuapp.com/api/auth/google';

const urlGoogle = 'http://localhost:8090/api/auth/google';
const urlManual = 'http://localhost:8090/api/auth/';





miFormulario.addEventListener('submit', ev => {
    // evita que se recargue la pagina
    ev.preventDefault();
    const formData = {};
    // leer los elementos con sus propiedades y valores
    for (let el of miFormulario.elements) {
        if (el.name.length > 0)
            formData[el.name] = el.value
    }



    fetch(urlManual + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(resp => resp.json()) // primer paso para obtener la respuesta y se convierte en json
        .then(({ msg, token }) => { // segundo paso y se lo desestructuramos
            if (msg) {
                return console.error(msg);
            }

            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(err => {
            console.log(err)
        })

});


function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    var id_token = googleUser.getAuthResponse().id_token;
    const data = { id_token };

    // coneccion del front con el back con el fetch
    // fetch retorna una promesa
    // regresa como formato json
    // fetch ya viene por defecto en los navegadores
    fetch(urlGoogle, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(resp => resp.json())
        // muestra todo la data
        // .then(data => console.log('Nuestro server', data))

        // muestra solo los campos de msg y token
        .then(({ msg, token }) => {
            if (msg) {
                return console.error(msg);
            }

            // el token lo almacenamos en el local storage
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(console.log);

}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}