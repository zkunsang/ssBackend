const Session = require("../models/redis/Session");
//const sessionExpireMs = 1000 * 60 * 60 * 2;

class UserCountDao {
    constructor(connection) {
        this.connection = connection.redis;
    }

    async incr() {
        return await this.connection.incr('userCount');
    }
}

module.exports = UserCountDao;