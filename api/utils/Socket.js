const Logger = require('./Logger');
const Config = require('../config.json');

let socket = null;

class Socket {

    Init = (server) => {
        this.io = require('socket.io')(server.server);
        /*
        const io = require('socket.io')(Config.server.port + 2, {
            path: '/socket'
        });
        */

        this.io.sockets.on('connection', (sock) => {
            socket = sock;
            Logger.info(`Socket.io - new connection`);
        });
    }

    Emit = (channel, data) => {
        if (this.io) {
            this.io.sockets.emit(channel, data);
            Logger.info(`Emit to clients on ${channel}`, data)
        }
    }

    Channels = {
        Character : 'CHARACTER',
        Event: 'EVENT',
        Composition: 'COMPOSITION',
        Option: 'OPTION'
    }

    Action = {
        Character : {
            Create: 'CHAR_CREATED',
            Update: 'CHAR_UPDATED',
            Delete: 'CHAR_DELETED'
        },
        Event: {
            Create: 'EVENT_CREATED',
            Update: 'EVENT_UPDATED',
            Delete: 'EVENT_DELETED'
        },
        Composition: {
            Create: 'COMPOSITION_CREATED',
            Update: 'COMPOSITION_UPDATED',
            Delete: 'COMPOSITION_DELETED'
        },
        Option: {
            Changed: 'OPTION_CHANGED'
        },
        Event: {
            Create: 'EVENT_CREATED',
            Update: 'EVENT_UPDATED',
            Delete: 'EVENT_DELETED'
        }
    }
}

module.exports = new Socket();