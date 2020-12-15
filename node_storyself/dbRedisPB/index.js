const ioredis = require('ioredis');
const ss = require('../index.js');
const dbCache = require('../dbCache');
const ArrayUtil = require('../util/ArrayUtil');

const Channels = {
    googleAuth: "googleAuth",
    dataTable: "dataTable",
    serverStatus: "serverStatus",
    ipList: "ipList",
    serverVariable: 'serverVariable',
    coupon: 'coupon'
}

class RedisPubSubHelper {
    constructor() {
        this.accessToken = null;
        this.serverStatus = null;
        this.whiteListMap = {};
    }

    async ready() {
        const { host, port } = ss.configs.dbRedisGA;
        const { subList } = ss.configs.dbRedisGA;

        this.redis = new ioredis({ host, port });
        if( subList.length == 0 ) return;

        this.accessToken = await this.redis.get(Channels.googleAuth);
        this.serverStatus = JSON.parse(await this.redis.get(Channels.serverStatus));
        
        this.redis.subscribe(Channels.googleAuth, async () => {
            console.log(`[${Channels.googleAuth}] - subscribe - Start`)
        });

        this.redis.subscribe(Channels.dataTable, async() => {
            console.log(`[${Channels.dataTable}] - subscribe - Start`)
        });

        this.redis.subscribe(Channels.serverStatus, async() => {
            console.log(`[${Channels.serverStatus}] - subscribe - Start`)
        });

        this.redis.subscribe(Channels.ipList, async() => {
            console.log(`[${Channels.ipList}] - subscribe - Start`)
        });

        this.redis.subscribe(Channels.serverVariable, async() => {
            console.log(`[${Channels.serverVariable}] - subscribe - Start`)
        });

        this.redis.subscribe(Channels.coupon, async() => {
            console.log(`[${Channels.coupon}] - subscribe - Start`)
        });

        this.redis.on("message", async (channel, message) => {
            if(channel == Channels.googleAuth) {
                this.accessToken = message;
            }
            else if(channel == Channels.dataTable) {
                await dbCache.reloadDataTableCache();
            }
            else if(channel == Channels.ipList) {
                await dbCache.reloadIPCache();
            }
            else if(channel == Channels.serverVariable) {
                await dbCache.reloadServiceVariable();
            }
            else if(channel == Channels.serverStatus) {
                this.serverStatus = JSON.parse(message);
            }
            else if(channel == Channels.coupon) {
                await dbCache.reloadCoupon();
            }
        })
    }

    getAccessToken() {
        return this.accessToken;
    }

    publish(channelId, message) {
        this.redis.publish(channelId, message)
    }
}

module.exports = new RedisPubSubHelper();
module.exports.Channels = Channels;