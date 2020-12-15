const PUSH_MESSAGE_KEY = 'push:message';
class PushMessageDao {
    constructor(connection) {
        this.connection = connection.redis;
    }

    async lpush(message) {
        await this.connection.lpush(PUSH_MESSAGE_KEY, JSON.stringify(message));
    }
}

module.exports = PushMessageDao;