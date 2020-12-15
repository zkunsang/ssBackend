const cmsSession = require('../models/redis/CmsSession');
const sessionExpire = 60 * 60 * 24;

class CmsSessionDao {
    constructor(connection) {
        this.connection = connection.redis;
    }

    async set(sessionId, admin) {
        await this.connection.set(`${cmsSession.key}:${sessionId}`, JSON.stringify(admin), 'ex', sessionExpire);
    }

    async get(sessionId) {
        return JSON.parse(await this.connection.get(`${cmsSession.key}:${sessionId}`));
    }

    async del(sessionId) {
        await this.connection.del(`${cmsSession.key}:${sessionId}`);
    }
}

module.exports = CmsSessionDao;