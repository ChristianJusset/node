// llamar a los puertos
require('dotenv').config();

// instancia para la plantilla server
const Server = require('./models/server');
const server = new Server();

server.listen();