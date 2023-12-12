const ioredis = require('ioredis');

const ss = require('../index.js');
const helper = require('../helper/index.js');

class RedisAI {
    constructor() {
        this.redis = null;
    }

    async ready() {
        const dbRedis = ss.configs.dbRedisAI;
        
        try {
            this.redis = new ioredis({ host: dbRedis.host, port: dbRedis.port });
            this.redisFetch = new ioredis({ host: dbRedis.host, port: dbRedis.port });

            this.aiRedisFetch()
        }
        catch (err) {
            helper.slack.sendMessage(err);
        }
    }

    aiRedisFetch = () => {
        setTimeout(() => this.fetchProcess(), 1)
    }

    fetchProcess = async () => {
        const [key, message] = await this.redisFetch.blpop(["ai:done"], 0);
        
        const jsonMessage = JSON.parse(message);
        const { prompt, fileName, puid, seedId } = jsonMessage;
        const imageLength = 3;

        await this.redis.set(`ai:status:${puid}`, JSON.stringify({ status: 2, prompt, fileName, puid, seedId, imageLength }));
        console.log(message);
        this.aiRedisFetch();
    }
}

module.exports = new RedisAI();