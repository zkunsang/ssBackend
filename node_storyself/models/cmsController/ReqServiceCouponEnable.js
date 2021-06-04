const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;
const Platform = ValidateUtil.Platform;

const Schema = {
    COUPON_ENABLE: { key: 'couponEnable', required: true, type: ValidType.BOOLEAN },
    PLATFORM: { key: 'platform', required: true, type: ValidType.STRING, validRange: Object.values(Platform) },
    CLIENT_VERSION: { key: 'clientVersion', required: true, type: ValidType.STRING },
}

class ReqServiceCouponEnable extends Model {
    constructor({ couponEnable, platform, clientVersion }) {
        super();
        this[Schema.COUPON_ENABLE.key] = couponEnable;
        this[Schema.PLATFORM.key] = platform;
        this[Schema.CLIENT_VERSION.key] = clientVersion;
    }

    getCouponEnable() {
        return this[Schema.COUPON_ENABLE.key];
    }

    getPlatform() {
        return this[Schema.PLATFORM.key];
    }

    getClientVersion() {
        return this[Schema.CLIENT_VERSION.key];
    }
}

module.exports = ReqServiceCouponEnable;
module.exports.Schema = Schema;