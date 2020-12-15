const ioredis = require('ioredis');

const ss = require('../index.js');
const helper = require('../helper');

class RedisSS {
    constructor() {
        this.redis = null;
    }

    async ready() {
        const dbRedis = ss.configs.dbRedisSS;
        
        try {
            this.redis = new ioredis({ host: dbRedis.host, port: dbRedis.port });
        }
        catch (err) {
            helper.slack.sendMessage(err);
        }
    }
}

module.exports = new RedisSS();