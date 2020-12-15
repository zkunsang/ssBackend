const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    COUPON_ID: { key: 'couponId', required: true, type: ValidType.STRING, },
}

class ReqCouponCodeList extends Model {
    constructor({ couponId }) {
        super();

        this[Schema.COUPON_ID.key] = couponId;
    }

    getCouponId() {
        return this[Schema.COUPON_ID.key];
    }
}

module.exports = ReqCouponCodeList;
module.exports.Schema = Schema;