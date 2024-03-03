const ioredis = require('ioredis');

const statusExpire = 60 * 60 * 3;
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
        const key = `ai:status:${uid}`;
        await this.connection.set(key, JSON.stringify(status))
        await this.connection.expire(key, statusExpire);
    }

    async delUserStatus(uid) {
        await this.connection.del(`ai:status:${uid}`);
    }

    async pushAIGenerate(prompt, fileName, seedId, uid, language, s3BucketName, mode) {
        await this.connection.lpush("ai:generate", JSON.stringify({ messageType: MESSAGE_TYPE_GENERATE, prompt, fileName, seedId, uid, language, s3BucketName, mode }))
    }
}

module.exports = AIDao;