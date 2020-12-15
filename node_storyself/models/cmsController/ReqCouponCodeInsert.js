const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    COUPON_ID: { key: 'couponId', required: true, type: ValidType.STRING },
    COUPON_CODE_LIST: { key: 'couponCodeList', required: true, type: ValidType.ARRAY },
}

class ReqCouponCodeInsert extends Model {
    constructor({ couponId, couponCodeList }) {
        super();

        this[Schema.COUPON_ID.key] = couponId;
        this[Schema.COUPON_CODE_LIST.key] = couponCodeList;
    }

    getCouponId() {
        return this[Schema.COUPON_ID.key];
    }

    getCouponCodeList() {
        return this[Schema.COUPON_CODE_LIST.key];
    }
}

module.exports = ReqCouponCodeInsert;
module.exports.Schema = Schema;