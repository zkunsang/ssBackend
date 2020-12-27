const Channels = require('../dbRedisPB').Channels;

class TempEventDao {
    constructor(connection) {
        this.connection = connection.redis;
    }

    async set(serverStatus) {
        await this.connection.set(`${Channels.betaEvent}`, JSON.stringify(serverStatus));
    }

    async get() {
        return JSON.parse(await this.connection.get(`${Channels.betaEvent}`));
    }

    publish(serverStatus) {
        this.connection.publish(`${Channels.betaEvent}`, JSON.stringify(serverStatus));
    }
}

module.exports = TempEventDao;