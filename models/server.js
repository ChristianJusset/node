// npm install express
const express = require('express');
// npm install cors
const cors = require('cors');

const { dbConnection } = require('../database/config');

const { createServer } = require('http');

//npm i express-fileupload
const fileUpload = require('express-fileupload');
const { socketController } = require('../sockets/controller');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer( this.app );
        this.io     = require('socket.io')(this.server)

        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';
        this.categorias = '/api/categorias';
        this.productos = '/api/productos';
        this.buscar = '/api/buscar';
        this.uploads = '/api/uploads';

        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

         // Sockets
         this.sockets();

    }

    // se va a correr con el config.js, donde se tiene la configuracion con la bd
    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Lectura y parseo del body para el llamado desde el front
        this.app.use(express.json());

        // Directorio Público
        this.app.use(express.static('public'));

        // Fileupload - Carga de archivos
        // lo recomienda el paquete de npm i express-fileupload
        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            // para crear el nombre de la carpeta
            createParentPath: true
        }));

    }

    // deja abierto las rutas que se encuentran en rutes/usuarios
    routes() {
        // ruta para la autenticacion
        this.app.use(this.authPath, require('../routes/auth'));

        // ruta para los usuarios
        this.app.use(this.usuariosPath, require('../routes/usuarios'));

        // path para categorias
        this.app.use(this.categorias, require('../routes/categorias'));

        // path para productos
        this.app.use(this.productos, require('../routes/productos'));


        // path para buscar
        this.app.use(this.buscar, require('../routes/buscar'));

        // path para buscar
        this.app.use(this.uploads, require('../routes/uploads'));

    }

    sockets() {
        this.io.on('connection', ( socket ) => socketController(socket, this.io ) )
    }


    listen() {
        // para trabajar sin sockets

        // this.app.listen(this.port, () => {
        //     console.log('Servidor corriendo en puerto', this.port);
        // });

        // para trabajar con sockets
        this.server.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });

        
    }
}

module.exports = Server;