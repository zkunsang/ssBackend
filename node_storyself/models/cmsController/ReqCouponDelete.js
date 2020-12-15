const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    COUPON_ID: { key: 'couponId', required: true, type: ValidType.STRING, },
}

class ReqCouponDelete extends Model {
    constructor({ couponId }) {
        super();

        this[Schema.COUPON_ID.key] = couponId;
    }

    getCouponId() {
        return this[Schema.COUPON_ID.key];
    }
}

module.exports = ReqCouponDelete;
module.exports.Schema = Schema;