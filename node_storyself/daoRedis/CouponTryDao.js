const couponTry = require('../models/redis/CouponTry');
const couponTryTTL = 60 * 60 * 1;

class CouponTryDao {
    constructor(connection) {
        this.connection = connection.redis;
    }

    async set(uid, hour) {
        await this.connection.incr(this.createKey(uid, hour));
        await this.connection.expire(this.createKey(uid, hour), couponTryTTL);
    }

    async get(uid, hour) {
        return await this.connection.get(this.createKey(uid, hour));
    }

    createKey(uid, hour) {
        return `${couponTry.key}_${hour}:${uid}`
    }
}

module.exports = CouponTryDao;