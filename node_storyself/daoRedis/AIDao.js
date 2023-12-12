const ioredis = require('ioredis');

const statusExpire = 60 * 3;
//const sessionExpireMs = 1000 * 60 * 60 * 2;

MESSAGE_TYPE_GENERATE = 1

class AIDao {
    /**
     * 
     * @param {Object} connection 
     * @param {ioredis.Redis} connection.redis 
     */
    constructor(connection) {
        this.connection = connection.redis;
    }

    async getUserStatus(puid) {
        const result = await this.connection.get(`ai:status:${puid}`)
        if(!result) return undefined;
        return JSON.parse(result);
    }

    async setUserStatus(puid, status) {
        await this.connection.set(`ai:status:${puid}`, JSON.stringify(status))
    }

    async delUserStatus(puid) {
        await this.connection.del(`ai:status:${puid}`);
    }

    async pushAIGenerate(prompt, fileName, seedId, puid) {
        await this.connection.lpush("ai:generate", JSON.stringify({ messageType: MESSAGE_TYPE_GENERATE, prompt, fileName, seedId, puid }))
    }
}

module.exports = AIDao;