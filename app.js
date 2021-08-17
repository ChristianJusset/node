// llamar a los puertos
// npm i dotenv
require('dotenv').config();

// instancia para la plantilla server
// models/server.js
const Server = require('./models/server');
const server = new Server();

server.listen();