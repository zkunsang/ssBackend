const Channels = require('../dbRedisPB').Channels;

class ServerStatusDao {
    constructor(connection) {
        this.connection = connection.redis;
    }

    async set(serverStatus) {
        await this.connection.set(`${Channels.serverStatus}`, JSON.stringify(serverStatus));
    }

    async get() {
        return JSON.parse(await this.connection.get(`${Channels.serverStatus}`));
    }

    publish(serverStatus) {
        this.connection.publish(`${Channels.serverStatus}`, JSON.stringify(serverStatus));
    }
}

module.exports = ServerStatusDao;