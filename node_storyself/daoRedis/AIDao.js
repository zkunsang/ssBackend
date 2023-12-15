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

    async getUserStatus(uid) {
        const result = await this.connection.get(`ai:status:${uid}`)
        if(!result) return undefined;
        return JSON.parse(result);
    }

    async setUserStatus(uid, status) {
        await this.connection.set(`ai:status:${uid}`, JSON.stringify(status))
    }

    async delUserStatus(uid) {
        await this.connection.del(`ai:status:${uid}`);
    }

    async pushAIGenerate(prompt, fileName, seedId, uid, language) {
        await this.connection.lpush("ai:generate", JSON.stringify({ messageType: MESSAGE_TYPE_GENERATE, prompt, fileName, seedId, uid, language }))
    }
}

module.exports = AIDao;