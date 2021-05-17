const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    COUPON_ENABLE: { key: 'couponEnable', required: true, type: ValidType.BOOLEAN },
}

class ReqServiceCouponEnable extends Model {
    constructor({ couponEnable }) {
        super();
        this[Schema.COUPON_ENABLE.key] = couponEnable;
    }

    getCouponEnable() {
        return this[Schema.COUPON_ENABLE.key];
    }
}

module.exports = ReqServiceCouponEnable;
module.exports.Schema = Schema;