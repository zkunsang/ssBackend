const ss = require('@ss');

const dbMongo = require("@ss/dbMongo");
const ioredis = require('ioredis');

const helper = require('../helper/index.js');
const UserDao = require('@ss/daoMongo/UserDao.js');
const FcmUtil = require('@ss/util/FcmUtil.js');

const generateMessage = (language) => {
    if(language == "kr") {
        const body = "어서 들어오세요"
        const title = "스티커 생성이 완료되었습니다."
        return [body, title];
    }

    const body = "come on"
    const title = "generate finished"
    return [body, title];
}

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
        const { prompt, fileName, uid, seedId, language } = jsonMessage;
        const imageLength = 3;

        await this.redis.set(`ai:status:${uid}`, JSON.stringify({ status: 2, prompt, fileName, uid, seedId, imageLength }));

        try {
            const userDao = new UserDao(dbMongo);
            const userInfo = await userDao.findOne({uid});
            const fcmToken = userInfo.getFCMToken();
            if(!!fcmToken) {
                const [body, title] = generateMessage(language)
                FcmUtil.pushMessage(fcmToken, title, body);
            }
        } catch(err) {
            console.error(err);
        }
        finally {
            this.aiRedisFetch();
        }
        
        
    }
}

module.exports = new RedisAI();