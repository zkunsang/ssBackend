const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    COUPON_CODE: { key: 'couponCode', required: true, type: ValidType.STRING },
}

class ReqCouponCheck extends Model {
    constructor({ couponCode }) {
        super();
        this[Schema.COUPON_CODE.key] = couponCode;
    }

    getCouponCode() {
        return this[Schema.COUPON_CODE.key];
    }
}

module.exports = ReqCouponCheck;
module.exports.Schema = Schema;