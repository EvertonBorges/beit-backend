const app = require('../src/app');
const mongoose = require('mongoose');
const configs = require('../config/default.json');
const mongooseConfigs = configs.mongoose.configs;
const debug = require('debug')('nodestr:server');
const { databaseConnectionStringDefault } = require('../config/constants');

mongoose.connect(databaseConnectionStringDefault, mongooseConfigs);

const db = mongoose.connection;

db.on('connected', () => {
    console.log('Mongoose default connection is open');
});

db.on('error', error => {
    console.log(`Mongoose default connection has occured \n${error}`);
});

db.on('disconnected', () => {
    console.log('Mongoose default connection is disconnected');
});

process.on('SIGINT', () => {
    db.close(() => {
        console.log('Mongoose default connection is disconnected due to application termination');
        process.exit(0);
    });
});

function normalizePort(val) {
    const port = parseInt(val, 10);

    if(isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}

const port = normalizePort(process.env.PORT || 3000);
app.set('port', port);

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    switch(error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
        default:
            throw error;
    }
}

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe' + addr : 'port' + addr.port;
    debug('Listening on ' + bind);
}

const server = app.listen(port);
server.on('error', onError);
server.on('listening', onListening);
console.log(`API is alive on ${port}`);

module.exports = server;